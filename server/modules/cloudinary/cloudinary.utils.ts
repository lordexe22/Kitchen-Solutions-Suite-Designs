// cloudinary.utils.ts
/* #info - Utilities for Cloudinary module */
// #section Imports
import type {
	CreateImageResponse,
	ImageMetadata,
	ReplaceImageResponse,
} from './cloudinary.types';
import { ValidationError } from './cloudinary.errors';
// #end-section

// #function _normalizePublicIdPart - Normaliza un segmento de publicId
/**
 * Normaliza un segmento de publicId (lowercase, sin espacios, sin caracteres inválidos).
 * @param value Segmento original
 * @returns Segmento normalizado
 * @version 1.0.0
 */
export const _normalizePublicIdPart = (value: string): string =>
	value
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-_]/g, '')
		.replace(/-+/g, '-')
		.replace(/^[-_]+|[-_]+$/g, '');
// #end-function

// #function _normalizeFolder - Normaliza el nombre de carpeta
/**
 * Normaliza el nombre de carpeta removiendo slashes innecesarios.
 * @param folder Carpeta original
 * @returns Carpeta normalizada
 * @version 1.0.0
 */
export const _normalizeFolder = (folder: string): string =>
	folder
		.replace(/^\/+/, '')
		.replace(/\/+$/, '')
		.replace(new RegExp('/+', 'g'), '/')
		.split('/')
		.map((part) => _normalizePublicIdPart(part))
		.filter(Boolean)
		.join('/');
// #end-function

// #function _toContextMetadata - Convierte metadata a context válido
/**
 * Convierte metadata a un objeto de strings compatible con Cloudinary.
 * @param metadata Metadata custom
 * @returns Context metadata listo para Cloudinary
 * @version 1.0.0
 */
export const _toContextMetadata = (
	metadata?: ImageMetadata
): Record<string, string> | undefined => {
	if (!metadata) return undefined;

	const entries = Object.entries(metadata).map(([key, value]) => [key, String(value)]);
	return entries.length ? Object.fromEntries(entries) : undefined;
};
// #end-function

// #function _isPlainObject - Valida si es objeto plano
/**
 * Valida si el valor es un objeto plano.
 * @param value Valor a validar
 * @returns boolean
 * @version 1.0.0
 */
export const _isPlainObject = (value: unknown): boolean => {
	if (!value || typeof value !== 'object') return false;
	if (Array.isArray(value)) return false;
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
};
// #end-function

// #function _hasNonSerializableValue - Detecta valores no serializables
/**
 * Detecta valores no serializables dentro de un objeto.
 * @param value Valor a inspeccionar
 * @returns boolean
 * @version 1.0.0
 */
export const _hasNonSerializableValue = (value: unknown): boolean => {
	const visited = new Set<unknown>();
	const stack: unknown[] = [value];

	while (stack.length > 0) {
		const current = stack.pop();
		if (!current) continue;
		if (visited.has(current)) continue;
		visited.add(current);

		if (typeof current === 'function' || typeof current === 'symbol') {
			return true;
		}

		if (typeof current === 'object') {
			for (const next of Object.values(current as Record<string, unknown>)) {
				stack.push(next);
			}
		}
	}

	return false;
};
// #end-function

// #function _buildPublicId - Construye publicId desde folder/prefix/name
/**
 * Construye publicId normalizado para Cloudinary.
 * @param folder Carpeta destino
 * @param name Nombre base
 * @param prefix Prefijo opcional
 * @returns Objeto con folder y publicId normalizados
 * @throws ValidationError si el resultado queda vacío
 * @version 1.0.0
 */
export const _buildPublicId = (
	folder: string,
	name: string,
	prefix?: string
): { folder: string; publicId: string } => {
	const normalizedFolder = _normalizeFolder(folder);
	const normalizedName = _normalizePublicIdPart(name);
	const normalizedPrefix = prefix ? _normalizePublicIdPart(prefix) : '';
	const publicId = normalizedPrefix
		? `${normalizedPrefix}-${normalizedName}`
		: normalizedName;

	if (!normalizedFolder || !publicId) {
		throw new ValidationError('Folder o nombre inválido tras normalización.');
	}

	return { folder: normalizedFolder, publicId };
};
// #end-function

// #function _validatePublicId - Valida formato de publicId
/**
 * Valida formato del publicId para eliminar recursos.
 * @param publicId Public ID a validar
 * @throws ValidationError si el formato es inválido
 * @version 1.0.0
 */
export const _validatePublicId = (publicId: string): void => {
	if (!publicId || !publicId.trim()) {
		throw new ValidationError('El publicId es requerido.');
	}

	if (!/^[a-z0-9/_-]+$/.test(publicId)) {
		throw new ValidationError('El publicId tiene un formato inválido.');
	}

	if (publicId.includes('//') || publicId.startsWith('/') || publicId.endsWith('/')) {
		throw new ValidationError('El publicId tiene un formato inválido.');
	}

	if (publicId.includes('..')) {
		throw new ValidationError('El publicId tiene un formato inválido.');
	}
};
// #end-function

// #function _normalizeCreateImageResponse - Normaliza la respuesta raw del SDK
/**
 * Normaliza la respuesta raw de Cloudinary a CreateImageResponse.
 * @param raw Respuesta raw del SDK
 * @param fallbackMetadata Metadata enviada en el upload
 * @returns CreateImageResponse normalizado
 * @version 1.0.0
 */
export const _normalizeCreateImageResponse = (
	raw: Record<string, unknown>,
	fallbackMetadata?: ImageMetadata
): CreateImageResponse => {
	const rawRecord = raw as Record<string, any>;
	const rawMetadata = rawRecord?.context?.custom as ImageMetadata | undefined;

	return {
		publicId: rawRecord.public_id,
		url: rawRecord.secure_url || rawRecord.url,
		width: rawRecord.width ?? 0,
		height: rawRecord.height ?? 0,
		format: rawRecord.format,
		size: rawRecord.bytes ?? 0,
		metadata: rawMetadata ?? fallbackMetadata,
		raw: raw,
	};
};
// #end-function

// #function _normalizeReplaceImageResponse - Normaliza respuesta de replaceImage
/**
 * Normaliza la respuesta raw de Cloudinary para replaceImage.
 * @param raw Respuesta raw del SDK
 * @param metadata Metadata enviada en el replace
 * @returns ReplaceImageResponse normalizado
 * @version 1.0.0
 */
export const _normalizeReplaceImageResponse = (
	raw: Record<string, unknown>,
	metadata: Record<string, any>
): ReplaceImageResponse => {
	const rawRecord = raw as Record<string, any>;
	return {
		publicId: rawRecord.public_id,
		secureUrl: rawRecord.secure_url || rawRecord.url,
		metadata,
		raw,
	};
};
// #end-function