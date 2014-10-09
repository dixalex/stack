class Question
  include Mongoid::Document
  include Mongoid::Timestamps

  field :title, type: String
  field :body, type: String
  field :_id, type: String, default: -> { Russian::transliterate(title.to_s).parameterize + '-' + Time.now.to_i.to_s }
  belongs_to :user

  validates_presence_of :title, :body, :user_id
  validates_uniqueness_of :_id, :title
end
