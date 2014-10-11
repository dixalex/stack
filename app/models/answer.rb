class Answer
  include Mongoid::Document
  include Mongoid::Timestamps

  field :accepted, type: Mongoid::Boolean
  field :body, type: String
  belongs_to :question
  belongs_to :user

  validates_presence_of :body, :user_id, :question_id
end
