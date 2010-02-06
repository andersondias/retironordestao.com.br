require File.expand_path(File.dirname(__FILE__) + '/tag_helpers')

module JuiceHelpers
  include TagHelpers

  def assets
    "http://retironordestao.tink.com.br"
  end

  def juice_css(files, target = :all)
    juice_it :css, files, target
    css_tag "#{target}.min.css"
  end

  def juice_js(files, target = :all)
    juice_it :js, files, target
    script_tag "#{target}.min.js"
  end

  private
  def juice_it(type, files, target)
    files_with_paths = files.inject('') { |partial, file| partial.concat("#{type}/_#{file}.#{type} ") }
    #puts "juicer merge #{files_with_paths} -o #{type}/#{target}.min.#{type} #{' -h ' + assets if assets} --document-root #{Dir.pwd} --ignore-problems --force" unless layout_type == 'internal_page'
    `juicer merge #{files_with_paths} -o #{type}/#{target}.min.#{type} #{' -h ' + assets if assets} #{' -l ' + assets if assets} --document-root #{Dir.pwd} --ignore-problems --force` unless layout_type == 'internal_page'
  end
end
