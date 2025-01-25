import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIPIENTS,
      subject: "New Land Cash Offer Submission",
      text: `
        New Land Submission Details:
        
        Contact Information:
        Name: ${body.name}
        Phone: ${body.phone}
        Email: ${body.email}
        
        Property Information:
        Address: ${body.address}
        City, State, ZIP: ${body.cityStateZip}
        Acreage: ${body.acreage}
        
        Property Description:
        ${body.description || 'No description provided'}
        
        Submitted on: ${new Date().toLocaleString()}
      `,
    })

    // Return a success response
    return NextResponse.json({ message: "Form submitted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error processing form submission:", error)
    return NextResponse.json({ message: "Error processing form submission" }, { status: 500 })
  }
}
