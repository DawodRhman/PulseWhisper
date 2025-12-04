import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const fullName = formData.get("fullName");
    const fatherName = formData.get("fatherName");
    const cnic = formData.get("cnic");
    const dob = formData.get("dob");
    const education = formData.get("education");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const coverLetter = formData.get("coverLetter");
    const careerOpeningId = formData.get("careerOpeningId");
    const resume = formData.get("resume");

    // 1. Validation
    if (!fullName || !fatherName || !cnic || !dob || !education || !email || !phone || !careerOpeningId || !resume) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. File Validation
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ["application/pdf"];

    if (resume.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(resume.type)) {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // 3. File Saving (Local Filesystem)
    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
    await mkdir(uploadDir, { recursive: true });

    // Generate safe filename
    const fileExtension = ".pdf"; // We enforced PDF type
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Convert File to Buffer
    const bytes = await resume.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file
    await writeFile(filePath, buffer);

    // 4. Database Record
    const application = await prisma.jobApplication.create({
      data: {
        fullName,
        fatherName,
        cnic,
        dob: new Date(dob),
        education,
        email,
        phone,
        coverLetter: coverLetter || "",
        resumeUrl: `/uploads/resumes/${fileName}`,
        careerOpeningId,
      },
    });

    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const careerOpeningId = searchParams.get("careerOpeningId");

    const where = careerOpeningId ? { careerOpeningId } : {};

    const applications = await prisma.jobApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        careerOpening: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ data: applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
