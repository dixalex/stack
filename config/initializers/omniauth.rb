Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github, Rails.application.secrets.omniauth_github_key, Rails.application.secrets.omniauth_github_secret, scope: 'user'
end