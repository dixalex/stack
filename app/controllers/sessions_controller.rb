# coding: utf-8
class SessionsController < ApplicationController
  def create
    auth = request.env['omniauth.auth']
    user = User.where(provider: auth['provider'],
                      uid: auth['uid'].to_s).first || User.create_with_omniauth(auth)
    reset_session
    session[:user_id] = user.id
    redirect_to root_url, :notice => 'Signed in!'
  end

  def show
    render json: {currentUser: current_user, authenticity_token: form_authenticity_token}
  end

  def destroy
    reset_session
    render nothing: true
  end

end
