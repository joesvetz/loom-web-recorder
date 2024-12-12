"use client";

import { useEffect, useState } from 'react';
import { setup } from "@loomhq/record-sdk";
import { isSupported } from "@loomhq/record-sdk/is-supported";
import { oembed } from "@loomhq/loom-embed";

export default function LoomRecorder() {
  const [status, setStatus] = useState('initializing');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initLoom() {
      try {
        const { supported, error: supportError } = await isSupported();
        if (!supported) {
          throw new Error(`Browser not supported: ${supportError}`);
        }

        // Get JWT from our auth endpoint
        const response = await fetch('/api/loom-auth');
        if (!response.ok) {
          throw new Error('Failed to get authentication token');
        }
        
        const { jwt, error: authError } = await response.json();
        if (authError) throw new Error(authError);
        if (!jwt) throw new Error('No authentication token received');

        const { configureButton } = await setup({
          jws: jwt // Use the JWT for authentication
        });

        const button = document.getElementById('loom-record-button');
        if (!button) throw new Error('Button element not found');

        // Remove the variable assignment since we don't use it
        configureButton({
          element: button,
          hooks: {
            onStart: () => {
              console.log('Recording started');
              setStatus('recording');
            },
            onComplete: async (video) => {
              try {
                console.log('Recording completed:', video);
                const { html } = await oembed(video.sharedUrl, { width: 400 });
                const target = document.getElementById('target');
                if (target) {
                  target.innerHTML = html;
                }
                setStatus('ready');
              } catch (error) {
                console.error('Error processing video:', error);
                setError('Failed to process video');
              }
            },
            onError: (error) => {
              console.error('Recording error:', error);
              setError(`Recording error: ${error.message}`);
              setStatus('error');
            }
          }
        });

        setStatus('ready');
      } catch (err) {
        console.error('Loom initialization error:', err);
        setError(err.message);
        setStatus('error');
      }
    }

    initLoom();
  }, []);

  return (
    <div className="container mx-auto p-4" style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white' }}>
      <h1 className="text-2xl mb-4">Loom Recorder</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full mb-4" style={{ color: 'black' }}>
        <h1 className="text-xl font-bold mb-4 text-center text-gray-800">Loom Recording Guide</h1>
        <ol className="space-y-4 text-gray-700">
          <li className="flex items-start">
            <span className="mr-3 text-blue-600 font-bold">1.</span>
            <p>Clicking the Start Recording button will pop-up a Loom Recorder.</p>
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-blue-600 font-bold">2.</span>
            <p>You will need to allow access to your microphone (camera is optional).</p>
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-blue-600 font-bold">3.</span>
            <p>Please use Loom as normal to record your issue <strong>while talking through it out loud</strong> (this is mandatory as it allows the AI to transcribe and summarize the problem to make it searchable).</p>
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-blue-600 font-bold">4.</span>
            <p>Once finished, click the Stop button, and copy-paste the link that is generated into your discussion post.</p>
          </li>
        </ol>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <button 
        id="loom-record-button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        disabled={status === 'initializing' || status === 'recording'}
      >
        {status === 'initializing' ? 'Loading...' : 
         status === 'recording' ? 'Recording...' : 
         'Start Recording'}
      </button>
      
      <div id="target" className="mt-4"></div>
    </div>
  );
}