import React from 'react'
import '../style/home.scss'

const Home = () => {
  return (
<div className='home-page'>
   <header className='page-header'>
  <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
  <p>Let our AI analyze the job requirements and your unique profile to build a winniny strategy.</p>
 </header>

 <div className='interview-card'>
    <div className='interview-card-body'>
      
     { /*Job description */}
        <div className="panel panel-left">
          <div className="panel-header">
          <span className='panel-icon'>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
          </span>
          <h2>Target job Description</h2>
          <span className='badge badge-required'>Required</span>
          </div>

          <textarea className='panel-textarea'
          placeholder={`Paste the full job description here... \ne.g 'Senior Frontend Engineer at Google requires proficinecy in React, TypeScript and large-scale system design...'`}
          maxLength={5000}

          />
          <div className="char-counter">0 / 5000 chars</div>
        </div>

        <div className="panel-divider"/>

        {/*Right Side */}
        <div className="panel panel-right">
          <div className="panel-header">
            <span className='panel-icon'>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </span>
            <h2>Your Profile</h2>
          </div>

          {/*Upload Resume */}
          <div className="upload-section">
            <label className="section-label">
              Upload Resume
              <span className='badge badge-best'>Best Results</span>
            </label>
            <label htmlFor="resume" className='dropzone'>
              <span className='dropzone-icon'>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>      
              </span>
              <p className='dropdzone-title'>Click to upload or drag &amp; drop </p>
              <p className='dropzone-subtitle'>PDF (Max 5MB)</p>
              <input hidden type="file" id='resume' name='resume' accept='.pdf' />
            </label>
          </div>

        {/*OR divider */}
        <div className="or-divider"><span>OR</span></div>
          {/*Quick Self-description */}
          <div className="self-description">
            <label htmlFor="selfDescription" className='section-label'>Quick Self-Description</label>
            <textarea name="selfDescription" id="selfDescription"
            className='panel-textarea panel-textarea-short'
            placeholder="Briefly describe your experience \, key skills, and years of experience if you don't have a resume handy..."
            />
          </div>

      {/*Info Box */}
      <div className="info-box">
        <span className="info-box-short">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
        </span>
        <p>Either a <strong>Resume </strong>or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
      </div>
        </div>
    </div>

    {/*Card Footer */}
    <div className="interview-card-footer">
      <span className="footer-info">
        AI-Powered Strategy Generation &bull; Approx 30s
      </span> 
      <button className="generate-btn">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
        Generate Interview Report
        
      </button>
    </div>
 </div>


 <footer className="page-footer">

  <a href="#">Privacy Policy</a>
  <a href="#">Terms of Services</a>
  <a href="#">Help center</a>
 </footer>

</div>
  )
}

export default Home
