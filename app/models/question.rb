class Question
  include Mongoid::Document
  include Mongoid::Timestamps

  field :title, type: String
  field :body, type: String
  field :_id, type: String, default: -> { name.to_s.parameterize }
  belongs_to :user

  validates_presence_of :title, :body
end
