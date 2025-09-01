export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  // @ts-expect-error
  loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
    lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    pdfjsLib = lib;
    return lib;
  });

  return loadPromise;
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    const lib = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    // safer scale
    const viewport = page.getViewport({ scale: 2.5 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      return { imageUrl: "", file: null, error: "Canvas not supported" };
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    await page.render({ canvasContext: context, viewport }).promise;

    return new Promise((resolve) => {
      let resolved = false;
      canvas.toBlob(
        (blob) => {
          if (resolved) return;
          resolved = true;
          if (blob) {
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });
            resolve({ imageUrl: URL.createObjectURL(blob), file: imageFile });
          } else {
            resolve({ imageUrl: "", file: null, error: "Failed to create blob" });
          }
        },
        "image/png",
        1.0
      );

      // fallback: resolve after 5s if toBlob never calls
      setTimeout(() => {
        if (!resolved) resolve({ imageUrl: "", file: null, error: "Blob timeout" });
      }, 5000);
    });
  } catch (err: any) {
    return { imageUrl: "", file: null, error: `Failed to convert PDF: ${err.message}` };
  }
}
