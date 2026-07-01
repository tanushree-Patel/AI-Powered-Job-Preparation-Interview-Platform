import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useInterview } from '../hooks/useInterview'
import '../style/download.scss'

const Download = () => {
  const { loading, reports, getReports, getResumePdf, viewResumePdf } = useInterview()
  const navigate = useNavigate()

  useEffect(() => {
    getReports()
  }, [])

  return (
    <div className='downloads-page'>
      <header className='page-header'>
        <button className='back-btn' onClick={() => navigate(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back
        </button>
        <h1>All Your Generated <span className='highlight'>Downloads</span></h1>
        <p>Manage and download all your resume templates and custom interview preparation assets.</p>
      </header>

      {loading && reports.length === 0 ? (
        <main className='loading-screen'>
          <h1>Fetching your reports...</h1>
        </main>
      ) : (
        <div className='downloads-container'>
          {reports.length === 0 ? (
            <div className='empty-state'>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <p>No interview reports generated yet.</p>
              <button className='button primary-button' onClick={() => navigate('/')}>
                Generate Plan Now
              </button>
            </div>
          ) : (
            <div className='downloads-grid'>
              {reports.map((report) => (
                <div key={report._id} className='download-card'>
                  <div className='card-header-section' onClick={() => navigate(`/interview/${report._id}`)}>
                    <h3>{report.title || 'Untitled Position'}</h3>
                    <p className='card-date'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                    <div className='badge-row'>
                      <span className={`match-score ${report.matchScore >= 80 ? 'score-high' : report.matchScore >= 60 ? 'score-mid' : 'score-low'}`}>
                        Match: {report.matchScore}%
                      </span>
                    </div>
                  </div>
                  <div className='card-actions'>
                    <button 
                      onClick={() => getResumePdf(report._id)}
                      className='button primary-button card-download-btn'
                    >
                      <svg height="0.9rem" style={{ marginRight: "0.5rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 19h16v-2H4v2zm9-10V3h-2v6H7l5 5 5-5h-4z"/></svg>
                      Download PDF
                    </button>
                    <button 
                      onClick={() => viewResumePdf(report._id)}
                      className='button card-view-btn'
                    >
                      <svg height="0.9rem" style={{ marginRight: "0.5rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      View PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Download
