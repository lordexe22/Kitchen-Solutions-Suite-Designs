// cloudinary.types.ts
/* #info - Type definitions for Cloudinary module */
// #type ImageSource
/**
 * Fuente de imagen soportada por el módulo.
 * @version 1.0.0
 */
export type ImageSource =
	| { type: 'url'; url: string }
	| { type: 'file'; filePath: string }
	| { type: 'buffer'; buffer: Buffer };
// #end-type
// #interface CreateImageOptions
/**
 * Opciones para crear una imagen en Cloudinary.
 * @version 1.0.0
 */
export interface CreateImageOptions {
	overwrite?: boolean;
	name: string;
	folder: string;
	prefix?: string;
}
// #end-interface
// #interface ImageMetadata
/**
 * Metadata custom (context) para Cloudinary.
 */
export interface ImageMetadata {
	[key: string]: string | number | boolean;
}
// #end-interface
// #interface ReplaceImageOptions
/**
 * Opciones para reemplazar una imagen existente.
 * @version 1.0.0
 */
export interface ReplaceImageOptions {
	overwrite?: true;
}
// #end-interface

// #interface ReplaceImageParams
/**
 * Parámetros para reemplazar una imagen existente.
 * @version 1.0.0
 */
export interface ReplaceImageParams {
	publicId: string;
	source: ImageSource;
	metadata?: Record<string, any>;
	overwrite?: boolean;
}
// #end-interface
// #interface CreateImageResponse
/**
 * Respuesta normalizada luego del upload.
 * @version 1.0.0
 */
export interface CreateImageResponse {
	publicId: string;
	url: string;
	width: number;
	height: number;
	format: string;
	size: number;
	metadata?: ImageMetadata;
	raw?: unknown;
}
// #end-interface

// #interface ReplaceImageResponse
/**
 * Respuesta al reemplazar una imagen.
 * @version 1.0.0
 */
export interface ReplaceImageResponse {
	publicId: string;
	secureUrl: string;
	metadata: Record<string, any>;
	raw: unknown;
}
// #end-interface
// #interface DeleteImageResponse
/**
 * Respuesta al eliminar una imagen.
 * @version 1.0.0
 */
export interface DeleteImageResponse {
	deleted: boolean;
}
// #end-interface

// #interface GetImageResult
/**
 * Respuesta al obtener una imagen.
 * @version 1.0.0
 */
export interface GetImageResult {
	publicId: string;
	url: string;
	secureUrl: string;
	width: number;
	height: number;
	format: string;
	bytes: number;
	metadata: Record<string, any>;
	raw: Record<string, any>;
}
// #end-interface
