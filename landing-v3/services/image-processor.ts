/**
 * 🚀 ATOMIC IMAGE PROCESSOR CORE
 * Advanced image processing for detecting and filling empty/transparent areas.
 * Optimized for agricultural drone imagery and precision mapping.
 */

export interface FillOptions {
    threshold: number;      // Alpha threshold (0-255) to consider a pixel "empty"
    radius: number;         // Search radius for surrounding pixels
    iterations: number;     // Number of diffusion passes for smoothness
    blendStrength: number;  // How much to blend with original edges (0-1)
    detectColor?: [number, number, number]; // Optional specific color to detect as "empty" (e.g., pure black [0,0,0])
}

export class AtomicImageProcessor {
    /**
     * Detects transparent or empty areas and returns a binary mask.
     */
    public detectMask(imageData: ImageData, options: FillOptions): Uint8Array {
        const { data, width, height } = imageData;
        const mask = new Uint8Array(width * height);
        const [targetR, targetG, targetB] = options.detectColor || [-1, -1, -1];

        for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];
            const pixelIdx = i / 4;

            // Detect transparency
            if (alpha < options.threshold) {
                mask[pixelIdx] = 1;
                continue;
            }

            // Detect specific color if provided
            if (targetR !== -1) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                if (r === targetR && g === targetG && b === targetB) {
                    mask[pixelIdx] = 1;
                }
            }
        }
        return mask;
    }

    /**
     * Robust Intelligent Fill Algorithm (Laplacian Diffusion Based)
     * Propagates surrounding pixels into empty regions while maintaining context.
     */
    public async intelligentFill(
        canvas: HTMLCanvasElement,
        options: FillOptions = { threshold: 10, radius: 2, iterations: 10, blendStrength: 0.8 }
    ): Promise<HTMLCanvasElement> {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error("Could not get canvas context");

        const width = canvas.width;
        const height = canvas.height;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const mask = this.detectMask(imageData, options);

        // Create a copy to work on
        const outputData = new Uint8ClampedArray(data);

        // Perform Multi-Pass Diffusion
        for (let iter = 0; iter < options.iterations; iter++) {
            const currentPass = new Uint8ClampedArray(outputData);

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = y * width + x;

                    if (mask[idx] === 1) {
                        let sumR = 0, sumG = 0, sumB = 0, count = 0;

                        // Sample neighbors within radius
                        for (let dy = -options.radius; dy <= options.radius; dy++) {
                            for (let dx = -options.radius; dx <= options.radius; dx++) {
                                const nx = x + dx;
                                const ny = y + dy;

                                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                    const nIdx = ny * width + nx;
                                    const nDataIdx = nIdx * 4;

                                    // Only sample from non-empty pixels or already filled pixels from previous pass
                                    if (mask[nIdx] === 0 || (iter > 0 && currentPass[nDataIdx + 3] > 0)) {
                                        const weight = 1 / (Math.sqrt(dx * dx + dy * dy) + 1);
                                        sumR += currentPass[nDataIdx] * weight;
                                        sumG += currentPass[nDataIdx + 1] * weight;
                                        sumB += currentPass[nDataIdx + 2] * weight;
                                        count += weight;
                                    }
                                }
                            }
                        }

                        if (count > 0) {
                            const dataIdx = idx * 4;
                            outputData[dataIdx] = sumR / count;
                            outputData[dataIdx + 1] = sumG / count;
                            outputData[dataIdx + 2] = sumB / count;
                            outputData[dataIdx + 3] = 255; // Mark as filled
                        }
                    }
                }
            }
        }

        // Apply results back to canvas
        ctx.putImageData(new ImageData(outputData, width, height), 0, 0);
        return canvas;
    }

    /**
     * Preserves quality and resolution by using an offscreen canvas.
     */
    public async processImageFile(
        file: File,
        options: Partial<FillOptions> = {}
    ): Promise<string> {
        const fullOptions: FillOptions = {
            threshold: 10,
            radius: 2,
            iterations: 15,
            blendStrength: 0.8,
            ...options
        };

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject("Canvas failure");

                ctx.drawImage(img, 0, 0);
                await this.intelligentFill(canvas, fullOptions);
                resolve(canvas.toDataURL(`image/${file.type.split('/')[1] || 'png'}`));
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }
}

export const atomicImageProcessor = new AtomicImageProcessor();
