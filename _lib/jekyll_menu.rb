module Jekyll::Menu
  def topic_posts(&block)
    posts = site.posts.select { |p| p.topics.empty? }
    posts_iterator(posts, &block)
  end

  def children_posts(&block)
    if page.respond_to?(:url)
      actual_page = page.topics[0] || page.url[1..page.url.size]
      posts = site.posts.select { |p| p.topics.include?(actual_page) }
      posts_iterator(posts, &block)
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
