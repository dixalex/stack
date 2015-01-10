class User
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :email, type: String
  field :uid, type: String
  field :provider, type: String
  validates_presence_of :name

  has_many :questions
  has_many :answers

  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth['provider']
      user.uid = auth['uid']
      if auth['info']
        user.name = auth['info']['name'] || auth['info']['email'].split('@')[0] || 'anonymous'
        user.email = auth['info']['email'] || ''
      end
    end
  end
end
