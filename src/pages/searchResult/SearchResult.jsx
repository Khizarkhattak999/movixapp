/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import './style.scss'
import { useParams } from 'react-router-dom'
import {fetchfromApi} from '../../utils/api'
import ContentWrapper from '../../components/contentWrapper/ContentWrapper'
import InfiniteScroll from 'react-infinite-scroll-component'
import MovieCard from '../../components/movieCard/MovieCard'

const SearchResult = () => {

  const [data, setData] = useState(null)
  const [pageNum, setPageNum] = useState(1)
  const [loading, setLoading] = useState(false)
  const {query} = useParams()


  const fetchInitialData = async () => {
    setLoading(true)
    const response = await fetchfromApi(`/search/multi?query=${query}&page=${pageNum}`)
    setData(response)
    setPageNum((prev) => prev + 1)
    setLoading(false)
  }


  const fetchNextPageResults = async () => {
    setLoading(true)
    const response = await fetchfromApi(`/search/multi?query=${query}&page=${pageNum}`)
    if(data?.results){
      setData({...data, results: [...data?.results, ...response?.results]})
    } else {
      setData(response)
    }
    setPageNum((prev) => prev + 1)
  }
  

  useEffect(() => {
   
    fetchInitialData()
  }, [query])

  return (
    <div className='searchResultsPage'>
    {loading && <h1>Loading...</h1>}
      {!loading && (
        <ContentWrapper>
          {data?.results?.length > 0 ? (
            <>
            <div className='pageTitle'>
            {`Search ${data?.total_results > 1 ? 'results' : 'result'} of '${query}'`}
            </div>

            <InfiniteScroll 
            className='content' 
            dataLength={data?.results?.length || []}  
            next={fetchNextPageResults}> 
            
            

            {data?.results?.map((item, index) => {
              if(item.media_type === 'person') return
              return (
                <MovieCard key={index} data={item} fromSearch={true}/>
              )
            })}
            </InfiniteScroll>
            </>
          ) : (
            <span className="resultNotFound">Sorry, Results Not Found!</span>
          )}
        </ContentWrapper>
      )}
    </div>
  )
}

export default SearchResult