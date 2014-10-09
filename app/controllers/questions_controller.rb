# coding: utf-8
class QuestionsController < ApplicationController
  def index
    @questions = Question.all.reverse
    render json: {questions: @questions}
  end

  def show
    @question = Question.find(params[:id])
    render json: { question: @question.as_json( include:
                                                    { user: { only: [:name] }
                                                    } ) }
  end

  def create
    @question = Question.new(params.permit(:title, :body))
    @question.user = current_user
    if @question.save
      render json: {question: @question}
    else
      render json: {errors: @question.errors.messages}, status: :unprocessable_entity
    end

  end
end
