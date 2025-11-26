import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";
import { createIssueSchema } from "@/app/validationSchemas";

export async function POST(request: NextRequest) {
  let body: any;

  // Body yoksa veya JSON parse edilemiyorsa 400 döndür
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json(
      { error: "Request body is required and must be valid JSON" },
      { status: 400 }
    );
  }

  // Body boş obje gelirse engelle (ör: {})
  if (!body || Object.keys(body).length === 0) {
    return NextResponse.json(
      { error: "Request body cannot be empty" },
      { status: 400 }
    );
  }

  // Zod validation
  const validation = createIssueSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const newIssue = await prisma.issue.create({
    data: {
      title: body.title,
      description: body.description,
    },
  });

  return NextResponse.json(newIssue, { status: 201 });
}
