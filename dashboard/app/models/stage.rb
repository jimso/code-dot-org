# Ordered partitioning of script levels within a script
# (Intended to replace most of the functionality in Game, due to the need for multiple app types within a single Game/Stage)
class Stage < ActiveRecord::Base
  has_many :script_levels, -> { order('position ASC') }, inverse_of: :stage
  belongs_to :script, inverse_of: :stages
  acts_as_list scope: :script

  validates_uniqueness_of :name, scope: :script_id

  def script
    Script.get_from_cache(script_id)
  end

  def to_param
    position.to_s
  end

  def unplugged?
    script_levels = Script.get_from_cache(self.script.name).script_levels.select{|sl| sl.stage_id == self.id}
    return false unless script_levels.first
    script_levels.first.level.unplugged?
  end

  def localized_title
    if script.stages.many?
      I18n.t('stage_number', number: position) + ': ' + I18n.t("data.script.name.#{script.name}.#{name}")
    else # script only has one stage/game, use the script name
      I18n.t "data.script.name.#{script.name}.title"
    end
  end

  def localized_name
    if script.stages.many?
      I18n.t "data.script.name.#{script.name}.#{name}"
    else
      I18n.t "data.script.name.#{script.name}.title"
    end
  end

  def lesson_plan_html_url
    "#{lesson_plan_base_url}/Teacher"
  end

  def lesson_plan_pdf_url
    "#{lesson_plan_base_url}/Teacher.pdf"
  end

  def lesson_plan_base_url
    CDO.code_org_url "/curriculum/#{script.name}/#{position}"
  end
end
