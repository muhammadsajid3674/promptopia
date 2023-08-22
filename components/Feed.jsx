'use client'

import { useEffect, useState } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data && data.map(post => (
        <PromptCard key={post._id} post={post} handleTagClick={handleTagClick} />
      ))}
    </div>
  )
}

const Feed = () => {
  const [posts, setPosts] = useState([]);
  // search states
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();
    setPosts(data)
  }
  const filteredPrompt = (searchText) => {
    // 'i' for case-insensitive search
    const regex = new RegExp(searchText, 'i');
    return posts.filter(item => regex.test(item.creator.username) || regex.test(item.tag) || regex.test(item.prompt))
  }
  const handleSearchChange = e => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filteredPrompt(e.target.value);
        setSearchResults(searchResult)
      }, 500)
    )
  }
  const handleTagClick = (tagName) => {
    setSearchText(tagName)
    const searchResult = filteredPrompt(tagName);
    setSearchResults(searchResult)
  }
  useEffect(() => {
    fetchPosts();
  }, [])

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type="text"
          placeholder='Search for a tag or username'
          onChange={handleSearchChange}
          value={searchText}
          required
          className='search_input peer'
        />
      </form>
       {/* All Prompts */}
       {searchText ? (
        <PromptCardList
          data={searchResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}
    </section>
  )
}

export default Feed