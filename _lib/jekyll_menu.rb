module Jekyll::Menu
  def topic_posts(&block)
    posts = site.posts.select { |p| p.topics.empty? }
    posts_iterator(posts, &block)
  end

  def children_posts(&block)
    if page.respond_to?(:url)
      posts = site.posts.select { |p| p.topics.include?(actual_page) }
      posts_iterator(posts, &block)
    end
  end

  def current_page_class(post)
    html = ''
    if page.title == post.title
      html = 'current'
    elsif actual_page == post.slug
      html = 'current'
    end
    html
  end

  def actual_page
    if page.respond_to?(:url)
      page.topics[0] || page.url[1..page.url.size]
    end
  end

  private
  def posts_iterator(posts, &block)
    if block.present?
      posts.each do |post|
        block.call(post)
      end
    else
      posts
    end
  end
end
