import { PlatformValidation } from '../types';
import { PLATFORMS } from '../constants/platforms';

interface ValidationResultsProps {
  validations: PlatformValidation[];
}

export default function ValidationResults({ validations }: ValidationResultsProps) {
  if (validations.length === 0) {
    return null;
  }

  return (
    <div className="validation-results">
      <h3>Platform Validation Results</h3>
      {validations.map((validation) => {
        const platform = PLATFORMS[validation.platform];
        return (
          <div
            key={validation.platform}
            className={`validation-card ${validation.isValid ? 'valid' : 'invalid'}`}
            style={{ borderLeftColor: platform.color }}
          >
            <div className="validation-header">
              <span className="platform-icon">{platform.icon}</span>
              <h4>{platform.name}</h4>
              {validation.isValid ? (
                <span className="status-badge success">✓ Ready to post</span>
              ) : (
                <span className="status-badge error">✗ Issues found</span>
              )}
            </div>

            {validation.errors.length > 0 && (
              <div className="validation-errors">
                <strong>Errors:</strong>
                <ul>
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.warnings.length > 0 && (
              <div className="validation-warnings">
                <strong>Warnings:</strong>
                <ul>
                  {validation.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.adaptedContent && (
              <div className="validation-adapted">
                <strong>Content will be adapted:</strong>
                {validation.adaptedContent.threads && (
                  <div>
                    <p>Will be split into {validation.adaptedContent.threads.length} thread(s):</p>
                    <ol>
                      {validation.adaptedContent.threads.map((thread, index) => (
                        <li key={index}>{thread}</li>
                      ))}
                    </ol>
                  </div>
                )}
                {validation.adaptedContent.images && (
                  <p>
                    {validation.adaptedContent.images.length} image(s) will be posted
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

