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
	RenameImageParams,
	MoveImageParams,
	ChangeImagePrefixParams,
	ListImagesParams,
	ListImagesResult,
	DeleteImageResponse,
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
	_splitPublicId,
	_validateNameSegment,
	_validateFolderPath,
	_normalizeListImageResult,
	_validateImageSource,
	_handleCloudinaryRenameError,
	_handleCloudinaryFetchError,
	_normalizeGetImageResult,
} from './cloudinary.utils';
import {
	UploadError,
	ValidationError,
	DeleteError,
	NotFoundError,
	ReplaceImageError,
	FetchImageError,
	RenameImageError,
	MoveImageError,
} from './cloudinary.errors';
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
	_validateImageSource(image);

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
	_validateImageSource(source);

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
// #function renameImage - Renombra una imagen sin reupload
/**
 * Renombra una imagen existente sin cambiar su contenido.
 * @param params Parámetros con publicId y newName
 * @returns GetImageResult normalizado
 * @throws ValidationError si la entrada no es válida
 * @throws NotFoundError si el recurso no existe
 * @throws RenameImageError si falla el renombre
 * @version 1.0.0
 */
export const renameImage = async (
	params: RenameImageParams
): Promise<GetImageResult> => {
	const { publicId, newName } = params;

	// #step 1 - Validar parámetros
	_validatePublicId(publicId);
	_validateNameSegment(newName, 'newName');
	// #end-step

	// #step 2 - Construir nuevo publicId
	const { folder, name } = _splitPublicId(publicId);
	if (newName === name) {
		throw new ValidationError('El nuevo nombre debe ser distinto al actual.');
	}
	const targetPublicId = folder ? `${folder}/${newName}` : newName;
	_validatePublicId(targetPublicId);
	// #end-step

	// #step 3 - Ejecutar rename
	const cloudinary = getCloudinaryClient();
	try {
		await cloudinary.uploader.rename(publicId, targetPublicId, {
			resource_type: 'image',
			overwrite: false,
		});
	} catch (error: any) {
		_handleCloudinaryRenameError(error, RenameImageError, publicId, targetPublicId);
	}
	// #end-step

	// #step 4 - Obtener datos normalizados
	return getImage(targetPublicId);
	// #end-step
};
// #end-function
// #function moveImage - Mueve una imagen a otra carpeta
/**
 * Mueve una imagen existente a otra carpeta sin reupload.
 * @param params Parámetros con publicId y targetFolder
 * @returns GetImageResult normalizado
 * @throws ValidationError si la entrada no es válida
 * @throws NotFoundError si el recurso no existe
 * @throws MoveImageError si falla el move
 * @version 1.0.0
 */
export const moveImage = async (
	params: MoveImageParams
): Promise<GetImageResult> => {
	const { publicId, targetFolder } = params;

	// #step 1 - Validar parámetros
	_validatePublicId(publicId);
	_validateFolderPath(targetFolder);
	// #end-step

	// #step 2 - Construir nuevo publicId
	const { folder, name } = _splitPublicId(publicId);
	if (folder === targetFolder) {
		throw new ValidationError('La carpeta destino debe ser distinta a la actual.');
	}
	const targetPublicId = `${targetFolder}/${name}`;
	_validatePublicId(targetPublicId);
	// #end-step

	// #step 3 - Ejecutar rename
	const cloudinary = getCloudinaryClient();
	try {
		await cloudinary.uploader.rename(publicId, targetPublicId, {
			resource_type: 'image',
			overwrite: false,
		});
	} catch (error: any) {
		_handleCloudinaryRenameError(error, MoveImageError, publicId, targetPublicId);
	}
	// #end-step

	// #step 4 - Obtener datos normalizados
	return getImage(targetPublicId);
	// #end-step
};
// #end-function
// #function changeImagePrefix - Cambia el prefijo de una imagen
/**
 * Cambia el prefijo del nombre y delega en renameImage.
 * @param params Parámetros de cambio de prefijo
 * @returns GetImageResult normalizado
 * @throws ValidationError si la entrada no es válida
 * @version 1.0.0
 */
export const changeImagePrefix = async (
	params: ChangeImagePrefixParams
): Promise<GetImageResult> => {
	const { publicId, prefix, mode } = params;

	// #step 1 - Validar parámetros
	_validatePublicId(publicId);
	if (!mode || !['replace', 'append', 'prepend'].includes(mode)) {
		throw new ValidationError('El mode es requerido y debe ser válido.');
	}

	if (prefix !== undefined) {
		_validateNameSegment(prefix, 'prefix');
	}

	if ((mode === 'append' || mode === 'prepend') && !prefix) {
		throw new ValidationError('El prefix es requerido para append/prepend.');
	}
	// #end-step

	// #step 2 - Calcular nuevo nombre
	const { name } = _splitPublicId(publicId);
	const separator = '-';
	const parts = name.split(separator);
	const existingPrefix = parts.length > 1 ? parts[0] : '';
	const baseName = existingPrefix ? parts.slice(1).join(separator) : name;

	let newName = name;
	if (mode === 'replace') {
		if (!prefix) {
			newName = baseName;
		} else if (existingPrefix === prefix) {
			newName = name;
		} else {
			newName = `${prefix}-${baseName}`;
		}
	}

	if (mode === 'prepend' && prefix) {
		newName = name.startsWith(`${prefix}-`) ? name : `${prefix}-${name}`;
	}

	if (mode === 'append' && prefix) {
		newName = name.endsWith(`-${prefix}`) ? name : `${name}-${prefix}`;
	}
	// #end-step

	// #step 3 - Delegar en renameImage
	if (newName === name) {
		return getImage(publicId);
	}

	return renameImage({ publicId, newName });
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

		return _normalizeGetImageResult(result, publicId);
	} catch (error: any) {
		if (error instanceof NotFoundError || error instanceof ValidationError || error instanceof FetchImageError) {
			throw error;
		}

		if (error?.error?.http_code === 404) {
			throw new NotFoundError(publicId);
		}

		throw _handleCloudinaryFetchError(error, { publicId });
	}
	// #end-step
};
// #end-function
// #function listImages - Lista imágenes en una carpeta
/**
 * Lista imágenes en una carpeta de Cloudinary con paginación.
 * @param params Parámetros de listado (folder, recursive, limit, cursor)
 * @returns ListImagesResult con items normalizados y nextCursor
 * @throws ValidationError si el folder es inválido
 * @throws FetchImageError si falla la consulta a Cloudinary
 * @version 1.0.0
 */
export const listImages = async (params: ListImagesParams): Promise<ListImagesResult> => {
	// Validar folder
	_validateFolderPath(params.folder);

	// Validar limit
	const limit = params.limit ?? 20;
	if (limit < 1 || limit > 100) {
		throw new ValidationError('El límite debe estar entre 1 y 100.');
	}

	try {
		const client = getCloudinaryClient();

		// Construir prefix con '/' al final
		const prefix = `${params.folder}/`;

		// Construir opciones para api.resources
		const options: Record<string, any> = {
			type: 'upload',
			resource_type: 'image',
			prefix,
			max_results: limit,
			context: true,
		};

		// Agregar cursor si existe
		if (params.cursor) {
			options.next_cursor = params.cursor;
		}

		// Llamar a api.resources
		const response = await client.api.resources(options);

		// Normalizar recursos
		const items: GetImageResult[] = [];
		const resources = (response.resources || []) as Record<string, any>[];

		for (const raw of resources) {
			// Filtrar por resource_type si Cloudinary no lo hizo
			if (raw.resource_type !== 'image') continue;

			// Si no es recursive, filtrar subdirectorios
			if (!params.recursive) {
				const publicId = raw.public_id as string;
				if (!publicId) continue; // Saltar si no tiene publicId
				// Contar slashes después del prefix
				const afterPrefix = publicId.slice(prefix.length);
				if (afterPrefix.includes('/')) continue; // Está en subdirectorio
			}

			// Normalizar recurso
			const normalized = _normalizeListImageResult(raw);
			if (normalized) {
				items.push(normalized);
			}
		}

		// Asegurar que respetamos el límite después de filtrar
		const finalItems = items.slice(0, limit);

		// Extraer nextCursor
		const nextCursor = response.next_cursor ? String(response.next_cursor) : undefined;

		return {
			items: finalItems,
			nextCursor,
		};
	} catch (error: any) {
		// Mapear errores de Cloudinary
		if (error?.error?.http_code === 404) {
			// Folder vacío no es error, devolver items vacíos
			return {
				items: [],
				nextCursor: undefined,
			};
		}

		throw _handleCloudinaryFetchError(error, { folder: params.folder });
	}
};
// #end-function