import { useState, useEffect } from 'react';
import { SocialPlatform, AuthenticatedAccount, PostContent, PlatformValidation } from './types';
import PlatformSelector from './components/PlatformSelector';
import ContentEditor from './components/ContentEditor';
import ValidationResults from './components/ValidationResults';
import { validateContentForPlatform } from './utils/contentValidator';
import { api } from './services/api';
import './App.css';

function App() {
  const [authenticatedAccounts, setAuthenticatedAccounts] = useState<AuthenticatedAccount[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [content, setContent] = useState<PostContent>({
    text: '',
    images: [],
    videos: [],
  });
  const [validations, setValidations] = useState<PlatformValidation[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [postResults, setPostResults] = useState<Array<{ success: boolean; platform: string; error?: string; postId?: string; url?: string }>>([]);

  // Load authenticated accounts on mount
  useEffect(() => {
    loadAccounts();
    
    // Check for OAuth callback
    const params = new URLSearchParams(window.location.search);
    const authStatus = params.get('auth');
    const platform = params.get('platform');
    
    if (authStatus === 'success' && platform) {
      alert(`Successfully connected to ${platform}!`);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
      loadAccounts();
    } else if (params.get('error')) {
      alert(`Authentication failed: ${params.get('error')}`);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const loadAccounts = async () => {
    try {
      const accounts = await api.getAccounts();
      setAuthenticatedAccounts(accounts);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    }
  };

  const handleAuthenticate = (platform: SocialPlatform) => {
    api.authenticate(platform);
  };

  const handlePlatformToggle = (platform: SocialPlatform) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platform)) {
        return prev.filter((p) => p !== platform);
      }
      return [...prev, platform];
    });
    // Clear validations when platforms change
    setValidations([]);
  };

  const handleValidate = () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    const results = selectedPlatforms.map((platform) =>
      validateContentForPlatform(content, platform)
    );
    setValidations(results);
  };

  const handlePost = async () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    // Check if all validations pass
    const hasErrors = validations.some((v) => !v.isValid);
    if (hasErrors) {
      alert('Please fix validation errors before posting');
      return;
    }

    if (validations.length === 0) {
      alert('Please validate your content first');
      return;
    }

    setIsPosting(true);
    setPostResults([]);

    try {
      const results = await api.postToPlatforms(selectedPlatforms, content);
      setPostResults(results);
      
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      if (failCount === 0) {
        alert(`✅ Successfully posted to ${successCount} platform(s)!`);
        // Reset form
        setContent({ text: '', images: [], videos: [] });
        setSelectedPlatforms([]);
        setValidations([]);
      } else {
        alert(`⚠️ Posted to ${successCount} platform(s), ${failCount} failed. Check results below.`);
      }
    } catch (error: any) {
      alert(`Error posting: ${error.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 PostPilot</h1>
        <p>Post to all your social media platforms at once</p>
      </header>

      <main className="app-main">
        <div className="main-content">
          <section className="content-section">
            <ContentEditor
              content={content}
              onChange={setContent}
              selectedPlatforms={selectedPlatforms}
              onValidate={handleValidate}
            />
          </section>

          <section className="platform-section">
            <PlatformSelector
              selectedPlatforms={selectedPlatforms}
              authenticatedAccounts={authenticatedAccounts}
              onPlatformToggle={handlePlatformToggle}
              onAuthenticate={handleAuthenticate}
            />
          </section>

          {validations.length > 0 && (
            <section className="validation-section">
              <ValidationResults validations={validations} />
            </section>
          )}

          {validations.length > 0 && validations.every((v) => v.isValid) && (
            <section className="post-section">
              <button 
                className="btn-post" 
                onClick={handlePost}
                disabled={isPosting}
              >
                {isPosting ? '⏳ Posting...' : '✈️ Post to Selected Platforms'}
              </button>
            </section>
          )}

          {postResults.length > 0 && (
            <section className="results-section">
              <h3>Post Results</h3>
              {postResults.map((result, index) => (
                <div
                  key={index}
                  className={`result-card ${result.success ? 'success' : 'error'}`}
                >
                  <strong>{result.platform}:</strong>{' '}
                  {result.success ? (
                    <span>
                      ✅ Posted successfully
                      {result.url && (
                        <a href={result.url} target="_blank" rel="noopener noreferrer">
                          {' '}View Post
                        </a>
                      )}
                    </span>
                  ) : (
                    <span>❌ {result.error}</span>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
