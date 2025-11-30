import { useState } from 'react';
import { SocialPlatform, AuthenticatedAccount, PostContent, PlatformValidation } from './types';
import PlatformSelector from './components/PlatformSelector';
import ContentEditor from './components/ContentEditor';
import ValidationResults from './components/ValidationResults';
import { validateContentForPlatform } from './utils/contentValidator';
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

  const handleAuthenticate = (platform: SocialPlatform) => {
    // TODO: Implement actual OAuth flow
    // For now, simulate authentication
    const newAccount: AuthenticatedAccount = {
      platform,
      username: `user_${platform}`,
      isAuthenticated: true,
      accessToken: 'mock_token',
    };

    setAuthenticatedAccounts((prev) => {
      const filtered = prev.filter((acc) => acc.platform !== platform);
      return [...filtered, newAccount];
    });
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

    // TODO: Implement actual posting logic
    alert(`Posting to: ${selectedPlatforms.join(', ')}\n\nThis will be implemented with actual API calls.`);
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
              <button className="btn-post" onClick={handlePost}>
                ✈️ Post to Selected Platforms
              </button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
