// cloudinary.ts
/* #info - Core service functions for Cloudinary image creation */
// #section Imports
import fs from 'fs';
import type {
	ImageSource,
	CreateImageOptions,
	ImageMetadata,
	CreateImageResponse,
	ReplaceImageOptions,
	ReplaceImageParams,
	ReplaceImageResponse,
	GetImageResult,
} from './cloudinary.types';
import { getCloudinaryClient } from './cloudinary.config';
import {
	_buildPublicId,
	_toContextMetadata,
	_normalizeCreateImageResponse,
	_validatePublicId,
	_isPlainObject,
	_hasNonSerializableValue,
	_normalizeReplaceImageResponse,
} from './cloudinary.utils';
import {
	UploadError,
	ValidationError,
	DeleteError,
	NotFoundError,
	ReplaceImageError,
	FetchImageError,
} from './cloudinary.errors';
import type { DeleteImageResponse } from './cloudinary.types';
// #end-section
// #function createImage - Sube una imagen a Cloudinary y retorna datos normalizados
/**
 * Sube una imagen a Cloudinary y retorna la respuesta normalizada.
 * @param image Fuente de la imagen (url, filePath o buffer)
 * @param options Opciones de creación (nombre, carpeta, prefix, overwrite)
 * @param metadata Metadatos custom que se guardan como context
 * @returns CreateImageResponse con datos útiles y el raw de Cloudinary
 * @throws ValidationError si la entrada no es válida
 * @throws UploadError si el upload falla
 * @version 1.0.0
 */
export const createImage = async (
	image: ImageSource,
	options: CreateImageOptions,
	metadata?: ImageMetadata
): Promise<CreateImageResponse> => {
	// #step 1 - Validar entrada principal
	if (!image) {
		throw new ValidationError('La imagen es requerida.');
	}

	if (!options?.name?.trim()) {
		throw new ValidationError('El nombre de la imagen es requerido.');
	}

	if (!options?.folder?.trim()) {
		throw new ValidationError('La carpeta de destino es requerida.');
	}
	// #end-step
	// #step 2 - Configurar cliente y parámetros del upload
	const cloudinary = getCloudinaryClient();

	const { folder, publicId } = _buildPublicId(
		options.folder,
		options.name,
		options.prefix
	);

	const uploadParams: Record<string, unknown> = {
		folder,
		public_id: publicId,
		overwrite: options.overwrite ?? false,
		resource_type: 'image',
		context: _toContextMetadata(metadata),
	};
	// #end-step
	// #step 3 - Resolver el tipo de fuente y ejecutar el upload
	let result: any;

	try {
		if (image.type === 'url') {
			if (!image.url?.trim()) {
				throw new ValidationError('La URL de la imagen no es válida.');
			}

			result = await cloudinary.uploader.upload(image.url, uploadParams);
		} else if (image.type === 'file') {
			if (!image.filePath?.trim()) {
				throw new ValidationError('La ruta del archivo no es válida.');
			}

			if (!fs.existsSync(image.filePath)) {
				throw new ValidationError(`No se encontró el archivo: ${image.filePath}`);
			}

			result = await cloudinary.uploader.upload(image.filePath, uploadParams);
		} else if (image.type === 'buffer') {
			if (!Buffer.isBuffer(image.buffer)) {
				throw new ValidationError('El buffer de la imagen no es válido.');
			}

			const base64 = image.buffer.toString('base64');
			const dataUri = `data:application/octet-stream;base64,${base64}`;
			result = await cloudinary.uploader.upload(dataUri, uploadParams);
		} else {
			throw new ValidationError('Tipo de fuente de imagen no soportado.');
		}
	} catch (error: any) {
		if (error instanceof ValidationError) {
			throw error;
		}

		const message = error?.message || 'Error al subir la imagen a Cloudinary.';
		throw new UploadError(message, { image, options, metadata }, error);
	}
	// #step 4 - Validar overwrite cuando el recurso ya existe
	if (options.overwrite === false && result?.existing === true) {
		throw new UploadError('El recurso ya existe y overwrite es false.', {
			image,
			options,
			metadata,
		});
	}
	// #end-step

	// #step 5 - Normalizar la respuesta
	return _normalizeCreateImageResponse(result, metadata);
	// #end-step
};
// #end-function

// #function deleteImage - Elimina una imagen por publicId
/**
 * Elimina una imagen en Cloudinary por su publicId.
 * @param publicId Public ID del recurso
 * @returns DeleteImageResponse con deleted true si se eliminó
 * @throws ValidationError si el publicId es inválido
 * @throws NotFoundError si el recurso no existe
 * @throws DeleteError si falla la eliminación
 * @version 1.0.0
 */
export const deleteImage = async (publicId: string): Promise<DeleteImageResponse> => {
	// #step 1 - Validar publicId
	_validatePublicId(publicId);
	// #end-step

	// #step 2 - Ejecutar eliminación
	const cloudinary = getCloudinaryClient();

	try {
		const result = await cloudinary.uploader.destroy(publicId, {
			resource_type: 'image',
		});

		if (result?.result === 'not found') {
			throw new NotFoundError(publicId);
		}

		if (result?.result === 'error') {
			throw new DeleteError('Error al eliminar la imagen en Cloudinary.', {
				publicId,
			});
		}

		return { deleted: true };
	} catch (error: any) {
		if (error instanceof ValidationError || error instanceof NotFoundError) {
			throw error;
		}

		const message = error?.message || 'Error al eliminar la imagen en Cloudinary.';
		throw new DeleteError(message, { publicId }, error);
	}
	// #end-step
};
// #end-function

// #function replaceImage - Reemplaza el binario de una imagen existente
/**
 * Reemplaza el binario de una imagen existente sin cambiar su publicId.
 * @param publicId Public ID del recurso a reemplazar
 * @param image Fuente de la nueva imagen (url, filePath o buffer)
 * @param options Opciones (overwrite siempre true internamente)
 * @param metadata Metadata opcional para reemplazar context
 * @returns CreateImageResponse normalizado
 * @throws ValidationError si la entrada no es válida
 * @throws UploadError si falla el reemplazo
 * @version 1.0.0
 */
export const replaceImage = async (
	params: ReplaceImageParams
): Promise<ReplaceImageResponse> => {
	const { publicId, source, metadata, overwrite } = params;

	// #step 1 - Validar parámetros de entrada
	_validatePublicId(publicId);

	if (!source) {
		throw new ValidationError('El source es requerido.');
	}

	if (!['url', 'file', 'buffer'].includes(source.type)) {
		throw new ValidationError('Tipo de fuente de imagen no soportado.');
	}

	if (source.type === 'url' && !source.url?.trim()) {
		throw new ValidationError('La URL de la imagen no es válida.');
	}

	if (source.type === 'file') {
		if (!source.filePath?.trim()) {
			throw new ValidationError('La ruta del archivo no es válida.');
		}

		if (!fs.existsSync(source.filePath)) {
			throw new ValidationError(`No se encontró el archivo: ${source.filePath}`);
		}
	}

	if (source.type === 'buffer' && !Buffer.isBuffer(source.buffer)) {
		throw new ValidationError('El buffer de la imagen no es válido.');
	}

	if (overwrite === false) {
		throw new ValidationError('replaceImage requiere overwrite=true.');
	}

	if (metadata !== undefined && !_isPlainObject(metadata)) {
		throw new ValidationError('La metadata debe ser un objeto plano.');
	}

	if (metadata !== undefined && _hasNonSerializableValue(metadata)) {
		throw new ValidationError('La metadata contiene valores no serializables.');
	}
	// #end-step

	// #step 2 - Verificar existencia del recurso
	const cloudinary = getCloudinaryClient();
	let existingMetadata: Record<string, any> = {};
	try {
		const resource = await cloudinary.api.resource(publicId, {
			resource_type: 'image',
			context: true,
		});
		existingMetadata = resource?.context?.custom ?? {};
	} catch (error: any) {
		if (error?.error?.http_code === 404) {
			throw new NotFoundError(publicId);
		}
		throw error;
	}
	// #end-step

	// #step 3 - Preparar parámetros de upload
	const normalizedMetadata =
		metadata === undefined
			? {}
			: Object.keys(metadata).length === 0
				? {}
				: { ...existingMetadata, ...metadata };
	const uploadParams: Record<string, unknown> = {
		public_id: publicId,
		overwrite: true,
		invalidate: true,
		resource_type: 'image',
		context: _toContextMetadata(normalizedMetadata as ImageMetadata),
	};
	// #end-step

	// #step 4 - Ejecutar upload según tipo de fuente
	let result: any;

	try {
		if (source.type === 'url') {
			if (!source.url?.trim()) {
				throw new ValidationError('La URL de la imagen no es válida.');
			}

			result = await cloudinary.uploader.upload(source.url, uploadParams);
		} else if (source.type === 'file') {
			if (!source.filePath?.trim()) {
				throw new ValidationError('La ruta del archivo no es válida.');
			}

			if (!fs.existsSync(source.filePath)) {
				throw new ValidationError(`No se encontró el archivo: ${source.filePath}`);
			}

			result = await cloudinary.uploader.upload(source.filePath, uploadParams);
		} else if (source.type === 'buffer') {
			if (!Buffer.isBuffer(source.buffer)) {
				throw new ValidationError('El buffer de la imagen no es válido.');
			}

			const base64 = source.buffer.toString('base64');
			const dataUri = `data:application/octet-stream;base64,${base64}`;
			result = await cloudinary.uploader.upload(dataUri, uploadParams);
		} else {
			throw new ValidationError('Tipo de fuente de imagen no soportado.');
		}
	} catch (error: any) {
		if (error instanceof ValidationError || error instanceof NotFoundError) {
			throw error;
		}

		const message = error?.message || 'Error al reemplazar la imagen en Cloudinary.';
		if (error?.code === 'ETIMEDOUT' || error?.code === 'ECONNREFUSED') {
			throw new ReplaceImageError(message, { publicId, source, metadata }, error);
		}
		throw new UploadError(message, { publicId, source, metadata }, error);
	}
	// #end-step

	// #step 5 - Normalizar respuesta
	return _normalizeReplaceImageResponse(result, normalizedMetadata as Record<string, any>);
	// #end-step
};
// #end-function

// #function getImage - Obtiene una imagen por publicId
/**
 * Obtiene una imagen desde Cloudinary.
 * @param publicId Public ID del recurso
 * @returns GetImageResult normalizado
 * @throws ValidationError si el publicId es inválido
 * @throws NotFoundError si el recurso no existe
 * @throws ConfigurationError si el cliente no está configurado
 * @throws FetchImageError si falla la consulta
 * @version 1.0.0
 */
export const getImage = async (publicId: string): Promise<GetImageResult> => {
	// #step 1 - Validar publicId
	_validatePublicId(publicId);
	// #end-step

	// #step 2 - Consultar recurso
	const cloudinary = getCloudinaryClient();
	try {
		const result = await cloudinary.api.resource(publicId, {
			resource_type: 'image',
			context: true,
		});

		if (result?.result === 'not found') {
			throw new NotFoundError(publicId);
		}

		if (!result || !result.public_id) {
			throw new FetchImageError('Respuesta inválida de Cloudinary.', { publicId }, result);
		}

		if (result?.resource_type && result.resource_type !== 'image') {
			throw new FetchImageError('El recurso no es una imagen.', {
				publicId,
				resourceType: result.resource_type,
			});
		}

		if (
			result?.secure_url == null ||
			result?.width == null ||
			result?.height == null
		) {
			throw new FetchImageError(
				'Respuesta incompleta de Cloudinary.',
				{ publicId },
				result
			);
		}

		const customContext = _isPlainObject(result?.context?.custom)
			? result.context.custom
			: {};
		const metadata = { ...customContext };

		return {
			publicId: result.public_id,
			url: result.url || '',
			secureUrl: result.secure_url || result.url || '',
			width: result.width ?? 0,
			height: result.height ?? 0,
			format: result.format,
			bytes: result.bytes ?? 0,
			metadata,
			raw: result,
		};
	} catch (error: any) {
		if (error instanceof NotFoundError || error instanceof ValidationError) {
			throw error;
		}

		if (error?.error?.http_code === 404) {
			throw new NotFoundError(publicId);
		}

		if (error?.code === 'ETIMEDOUT' || error?.code === 'ECONNREFUSED') {
			throw new FetchImageError('Error de red al obtener imagen.', { publicId }, error);
		}

		if (error?.error?.http_code === 401 || error?.error?.http_code === 403) {
			throw new FetchImageError('Error de autenticación al obtener imagen.', { publicId }, error);
		}

		if (error?.error?.http_code && error.error.http_code >= 500) {
			throw new FetchImageError('Error del servicio Cloudinary.', { publicId }, error);
		}

		throw new FetchImageError(
			error?.message || 'Error al obtener la imagen en Cloudinary.',
			{ publicId },
			error
		);
	}
	// #end-step
};
// #end-function