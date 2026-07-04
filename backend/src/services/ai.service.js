const { GoogleGenAI } = require('@google/genai')
const { z } = require("zod")
const puppeteer = require('puppeteer')

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),

})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
                Resume:${resume}
                Self Description:${selfDescription}
                Job Description:${jobDescription}`

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: interviewReportSchema.toJSONSchema()
        }
    })
    console.log(response.text);
    const result = interviewReportSchema.parse(JSON.parse(response.text));

    return result;
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true
    })
    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `
Generate a professional ATS-friendly resume for the following candidate.

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

Return ONLY a valid JSON object in the following format:
{
  "html": "<complete HTML document>"
}

Requirements:

- The value of "html" must be a complete HTML document that can be directly converted to PDF using Puppeteer.
- The final PDF MUST fit on EXACTLY ONE A4 page.
- Never generate content that would overflow onto a second page.
- Dynamic Content Density:
  - If the candidate is a student or has limited professional experience, you should make their descriptions, projects, and achievements more detailed (e.g. 3-4 bullet points per project/experience, and slightly longer descriptions of 15-25 words per bullet) so that the content flows beautifully and naturally fills 75-90% of the single A4 page, avoiding looking empty or ending midway.
  - If the candidate has extensive experience, focus on summarizing and using 2-3 concise bullets per experience/project to ensure everything fits perfectly on exactly one page.
- Prioritize the most relevant skills, experience, education, and projects for the target job description.
- Limit professional summary to 2-3 sentences.
- Include at most:
  - 5 skills categories
  - 3 work experiences (or 3 projects if work experience is limited)
  - Education: Include all levels of education present in the candidate's profile (including College/University, Class XII / 12th grade / Intermediate, and Class X / 10th grade if present), especially since they are a student/fresh graduate.
  - Certifications/Achievements if relevant
- Layout & Section Rules:
  - Skills: Always list each skills category vertically (each category on its own line/row, e.g. "**Languages**: JavaScript, C++") rather than in horizontal columns or a single row. This ensures readability and a clean structure.
  - Bullets: Use standard vertical bullet lists (<ul> and <li>) for experiences, projects, and achievements.
- Do NOT include unnecessary explanations, objectives, hobbies, references, or filler content.
- The design should be clean, modern, and professional with minimal colors.
- Use readable fonts and compact spacing.
- The resume must look natural and human-written, not AI-generated.
- Optimize the resume for ATS parsing by using semantic HTML and clear section headings.
- The HTML should use CSS that is compact enough to ensure the resume remains on one A4 page.

- The generated HTML MUST include the following CSS inside the <head> section:

<style>
@page {
    size: A4;
    margin: 12mm 15mm;
}

html, body {
    width: 100%;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    font-size: 10.5px;
    line-height: 1.35;
    color: #333;
}

* {
    box-sizing: border-box;
}

body {
    padding: 0;
}

h1 {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 4px;
    color: #111;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

h2 {
    font-size: 12px;
    font-weight: 700;
    margin: 14px 0 6px;
    border-bottom: 1.5px solid #222;
    padding-bottom: 3px;
    color: #111;
    text-transform: uppercase;
    letter-spacing: 0.8px;
}

p {
    margin: 3px 0 4px;
}

ul {
    margin: 4px 0;
    padding-left: 18px;
}

li {
    margin: 3px 0;
}

section {
    margin-bottom: 10px;
}

a {
    color: #0056b3;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
</style>

- The resume MUST fit on exactly ONE A4 page.
- Keep the total content under 600 words.
- If all information cannot fit, remove the least relevant items instead of reducing the font size below 10.5px.

- Return ONLY the JSON object. Do not include markdown or any additional text.

`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: resumePdfSchema.toJSONSchema(),
        }
    })
    const jsonContent = resumePdfSchema.parse(JSON.parse(response.text))
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }