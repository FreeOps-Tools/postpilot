import { useState, useRef } from 'react';
import { PostContent } from '../types';

interface ContentEditorProps {
  content: PostContent;
  onChange: (content: PostContent) => void;
  selectedPlatforms: string[];
  onValidate: () => void;
}

export default function ContentEditor({
  content,
  onChange,
  selectedPlatforms,
  onValidate,
}: ContentEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...content,
      text: e.target.value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onChange({
      ...content,
      images: [...content.images, ...files],
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onChange({
      ...content,
      videos: [...content.videos, ...files],
    });
  };

  const removeImage = (index: number) => {
    onChange({
      ...content,
      images: content.images.filter((_, i) => i !== index),
    });
  };

  const removeVideo = (index: number) => {
    onChange({
      ...content,
      videos: content.videos.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="content-editor">
      <h3>Create Your Post</h3>
      
      <div className="editor-section">
        <label htmlFor="post-text">Post Content</label>
        <textarea
          id="post-text"
          className="text-input"
          value={content.text}
          onChange={handleTextChange}
          placeholder="What's on your mind?"
          rows={8}
        />
        <div className="char-count">{content.text.length} characters</div>
      </div>

      <div className="editor-section">
        <label>Media</label>
        <div className="media-upload-buttons">
          <button
            type="button"
            className="btn-upload"
            onClick={() => fileInputRef.current?.click()}
          >
            📷 Add Images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          
          <button
            type="button"
            className="btn-upload"
            onClick={() => videoInputRef.current?.click()}
          >
            🎥 Add Videos
          </button>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoUpload}
            style={{ display: 'none' }}
          />
        </div>

        {content.images.length > 0 && (
          <div className="media-preview">
            <h4>Images ({content.images.length})</h4>
            <div className="media-grid">
              {content.images.map((image, index) => (
                <div key={index} className="media-item">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                  />
                  <button
                    className="btn-remove"
                    onClick={() => removeImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.videos.length > 0 && (
          <div className="media-preview">
            <h4>Videos ({content.videos.length})</h4>
            <div className="media-grid">
              {content.videos.map((video, index) => (
                <div key={index} className="media-item">
                  <video
                    src={URL.createObjectURL(video)}
                    controls
                    style={{ maxHeight: '150px' }}
                  />
                  <button
                    className="btn-remove"
                    onClick={() => removeVideo(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedPlatforms.length > 0 && (
        <button className="btn-validate" onClick={onValidate}>
          Validate for Selected Platforms
        </button>
      )}
    </div>
  );
}

