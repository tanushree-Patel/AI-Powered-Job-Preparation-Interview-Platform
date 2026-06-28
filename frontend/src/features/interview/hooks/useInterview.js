import { useContext, useEffect } from "react";
import { getAllInterviewReports, generateInterviewreport,getInterviewReportById,generateResumePdf } from "../services/interview.api";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";


export const useInterview=()=>{
    const context=useContext(InterviewContext)
    const {interviewId}=useParams()

   const {loading,setloading,report,setreport,reports,setreports}=context

   const getReports=async()=>{
    setloading(true)
    let response=null
    try{
        response=await getAllInterviewReports()
        setreports(response.interviewReports)
    }
    catch(err){
        console.log(err)
    } finally{
        setloading(false)
    }

    return response.interviewReports
   }

   const generateReport=async({jobDescription,selfDescription,resumeFile})=>{
    setloading(true)
    let response=null
    try{
        response=await generateInterviewreport({jobDescription,selfDescription,resumeFile})
        setreport(response.interviewReport)
    }
    catch(err){
        console.log(err)
        
    } finally{
        setloading(false)
    }
    return response.interviewReport
   }

    const getReportById=async(interviewId)=>{
        setloading(true)
        let response=null
        try{
            response=await getInterviewReportById(interviewId)
            setreport(response.interviewReport)
        }catch(err){
            console.log(err)   
        } finally{
            setloading(false)
        }
        return response.interviewReport
    }

    const getResumePdf=async(interviewReportId)=>{
        setloading(true)
        let response=null
        try{
            response=await generateResumePdf({interviewReportId})
            const url=window.URL.createObjectURL(new Blob([response],{type:'application/pdf'}))
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download',`resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }catch(err){
            console.log(err)      
        }finally{
            setloading(false)
        }
    }
    useEffect(() => {
    if(interviewId){
        getReportById(interviewId)
    }else{
        getReports()
    }
    }, [])
    return {loading,report,reports,getReports,generateReport,getReportById,getResumePdf}

}