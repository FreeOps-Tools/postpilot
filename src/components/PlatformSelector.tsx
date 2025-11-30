import { SocialPlatform, AuthenticatedAccount } from '../types';
import { PLATFORMS } from '../constants/platforms';

interface PlatformSelectorProps {
  selectedPlatforms: SocialPlatform[];
  authenticatedAccounts: AuthenticatedAccount[];
  onPlatformToggle: (platform: SocialPlatform) => void;
  onAuthenticate: (platform: SocialPlatform) => void;
}

export default function PlatformSelector({
  selectedPlatforms,
  authenticatedAccounts,
  onPlatformToggle,
  onAuthenticate,
}: PlatformSelectorProps) {
  const getAccountStatus = (platform: SocialPlatform) => {
    return authenticatedAccounts.find((acc) => acc.platform === platform);
  };

  return (
    <div className="platform-selector">
      <h3>Select Platforms</h3>
      <div className="platform-grid">
        {Object.values(PLATFORMS).map((platform) => {
          const account = getAccountStatus(platform.id);
          const isAuthenticated = account?.isAuthenticated || false;
          const isSelected = selectedPlatforms.includes(platform.id);

          return (
            <div
              key={platform.id}
              className={`platform-card ${isSelected ? 'selected' : ''} ${
                !isAuthenticated ? 'not-authenticated' : ''
              }`}
              style={{ borderColor: platform.color }}
            >
              <div className="platform-header">
                <span className="platform-icon">{platform.icon}</span>
                <h4>{platform.name}</h4>
              </div>
              <div className="platform-status">
                {isAuthenticated ? (
                  <span className="status-badge authenticated">
                    ✓ Connected as {account?.username || 'User'}
                  </span>
                ) : (
                  <span className="status-badge not-authenticated">
                    Not connected
                  </span>
                )}
              </div>
              <div className="platform-actions">
                {!isAuthenticated ? (
                  <button
                    className="btn-auth"
                    onClick={() => onAuthenticate(platform.id)}
                    style={{ backgroundColor: platform.color }}
                  >
                    Connect {platform.name}
                  </button>
                ) : (
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onPlatformToggle(platform.id)}
                    />
                    <span>Post to {platform.name}</span>
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

