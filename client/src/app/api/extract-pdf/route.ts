import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    // Check if request is multipart form data
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    // Get form data
    const formData = await req.formData();
    const pdfFile = formData.get("pdf") as File;

    if (!pdfFile) {
      return NextResponse.json({ error: "No PDF file uploaded" }, { status: 400 });
    }

    // Check file type
    if (!pdfFile.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    // Create temp path
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, `upload-${Date.now()}.pdf`);
    
    // Write file to temp location
    const fileBuffer = Buffer.from(await pdfFile.arrayBuffer());
    await writeFile(filePath, fileBuffer);
    
    // Mock PDF text extraction
    // In a real implementation, you would use a PDF parsing library
    // like pdf-parse, or call a PDF extraction API
    
    // Here's a mock response:
    const extractedText = `This is extracted text from the PDF "${pdfFile.name}".
    
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, 
nisl nec ultricies lacinia, nunc nisl aliquam massa, eget aliquam nisl nunc 
vel nisl. Donec euismod, nisl eget aliquam lacinia, nunc nisl aliquam massa,
eget aliquam nisl nunc vel nisl.

The PDF was ${fileBuffer.length / 1024} KB in size and contained several pages
of content that could be used to generate quiz questions.`;

    // Return the extracted text
    return NextResponse.json({ 
      text: extractedText,
      fileName: pdfFile.name,
      size: fileBuffer.length
    });
    
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}