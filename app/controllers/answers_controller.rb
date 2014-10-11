# coding: utf-8
class AnswersController < ApplicationController

  def create
    @question = Question.find(params[:question_id])
    @answer = Answer.new(params.require(:answer).permit(:body))
    @answer.user = current_user
    @answer.question = @question
    if @answer.save
      render json: {answer: @answer}
    else
      render json: {errors: @answer.errors.messages}, status: :unprocessable_entity
    end
  end

end