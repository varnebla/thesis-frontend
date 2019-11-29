import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-chaos';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';

import Console from '../Console/Console';

import { useDispatch, useSelector } from 'react-redux';
import { getApplication, updateTestCreator, submitApplication } from '../../redux/applicant';


import './Applicant.css';

function Applicant () {

  const dispatch = useDispatch();
  const applicant = useSelector(store => store.applicant);
  const testStats = useSelector(store => store.applicant.situation.stats);
  
  const [ code, setCode ] = useState('');
  const [ loading, setLoading ] = useState(true);
  const [ showInst, setShowInst ] = useState(false);
  const [ showSub, setShowSub ] = useState(false);

  const setModalInst = () => setShowInst(!showInst);
  const setModalSub = () => setShowSub(!showSub);

  const handleCodeChange = e => {
    setCode(e);
  };

  const setLoad = () => setLoading(false);

  const handleTest = () => {
    const tests = applicant.exercise.tests;
    const final = code + '\n' + tests;
    const frame = document.getElementById('sandboxed');
    frame.contentWindow.postMessage(final, '*');
  };

  const checkPassed = (tests, passes) => {
    if (tests === passes) return 'passed';
    return 'failed';
  };

  const handleSubmit = () => {
    handleTest();
    console.log(applicant.situation);
    if (Object.keys(applicant.situation).length) {
      console.log(testStats);
      const passed = checkPassed(applicant.situation.stats.tests, applicant.situation.stats.passes);
      const report = {
        code,
        time: Date.now(), 
        passed
      };
      console.log(report);
    }
  };

  const loadCode = placeholderCode => setCode(placeholderCode);

  useEffect(() => {
    const id = '5ddff9cfbc599e6ddaceff05';
    dispatch(getApplication(id));
    setTimeout(setLoad, 1000);
    window.addEventListener('message', e => {
      const frame = document.getElementById('sandboxed');
      if (e.origin === 'null' && e.source === frame.contentWindow) {
        dispatch(updateTestCreator(e.data));
      }
    });
  }, []);

  return (
    <Router>
      {
        loading
          ? <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          : <div className="applicant-container">
            <div className="applicant-countdown">
              <div className="top-countdown">10:00</div>
            </div>
            <div className="applicant-top">
              <div className="top-logo">Codeval</div>
              <div className="top-buttons">
                <button className="top-instructions-btn" onClick={setModalInst}>Instructions</button>
                <Modal show={showInst} onHide={setModalInst}>
                  <h1>Instructions</h1>
                  <p>{applicant.exercise.instructions}</p>
                </Modal>
                <button className="top-submit-btn" onClick={setModalSub}>Submit</button>
                <Modal show={showSub} onHide={setModalSub}>
                  <p>Are you sure you want to submit?</p>
                  <button onClick={setModalSub}>No</button>
                  <button onClick={handleSubmit}>Yes</button>
                </Modal>
              </div>
            </div>

            <div className="applicant-test">
              <div className="applicant-editor">
                <AceEditor
                  mode='javascript'
                  theme='monokai'
                  onChange={handleCodeChange}
                  value={code}
                  height='100%'
                  width='100%'
                  // defaultValue={applicant.exercise.placeholderCode}
                  name='editorExercise'
                  onLoad={() => loadCode(applicant.exercise.placeholderCode)}
                />
              </div>
              <div className="applicant-console-container">
                <div className="applicant-console">
                  <Console/>
                </div>
                <button className="applicant-test-btn" onClick={handleTest}>Test</button>
              </div>
            </div>
            <iframe style={{display: 'none'}} sandbox='allow-scripts' title='dontknow' id='sandboxed' src={process.env.PUBLIC_URL + '/test.html'}></iframe>
          </div>
      }
    </Router>

  );
}

export default Applicant;