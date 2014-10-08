# coding: utf-8
class QuestionsController < ApplicationController
  def index
    @questions = Question.all
    render json: {questions: @questions}
  end

  def show
    @question = Question.find(params[:id])
    render json: {question: @question}
  end
end
