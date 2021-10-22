import React, { useState, useEffect } from 'react';
import css from '../styles/Preview.module.css';
import Preview from '../components/Movies/Preview.jsx';
import Main from '../components/Movies/Main.jsx';

const Movies = ({ content }) => {
  // using state to store movie data for preview and main. Also used to render components once data is received from server.
  const [preview, setPreview] = useState(null);
  const [main, setMain] = useState(null);
  //
  const [page, setPage] = useState(1);

  const [mainError, setMainError] = useState('');
  const [previewError, setPreviewError] = useState('');

  // assigning content to home when users first visit our page
  if (!content) content = 'home';

  // making a request to the server to fetch movie data for both preview and main components. The type of content that should be displayed is sent with the request. Two different request are made so preview content will be rendered quickly and wouldn't need to wait for main content data to be received.
  useEffect(() => {
    fetch(`/movie/content?content=${content}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        console.log('MAIN ', data.main)
        if (data.status) throw new Error('Error', { cause: data.message });
        setPreview(data.preview);
      })
      .catch(err => {
        console.log(err.cause);
        setPreviewError('An error has occured when loading preview content. Please try again or try again later')
      })


    // fetch(`/movie/preview?content=${content}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log('Preview')
    //     if (data.status) throw new Error('Error', { cause: data.message });
    //     setPreview(data.preview);
    //   })
    //   .catch(err => {
    //     console.log(err.message);
    //     setPreviewError('An error has occured when loading preview content. Please try again or try again later')
    //   })

    //   fetch(`/movie/main?content=${content}&page=${page}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log('Main')
    //     console.log(data);
    //     if (data.status) throw new Error('Error', { cause: data.message });
    //     // setPreview(data.preview);
    //   })
    //   .catch(err => {
    //     console.log(err.cause)
    //     setMainError('An error has occured when loading main content. Please try again or try again later');
    //     console.log(err);
    //   })
  }, [])

  // useEffect(() => {
  //   fetch(`/movie/main?content=${content}&page=${page}`)
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log(data);
  //       if (data.status) throw new Error('Error', { cause: data.message });
  //       // setPreview(data.preview);
  //     })
  //     .catch(err => {
  //       console.log(err.cause)
  //       setMainError('An error has occured when loading main content. Please try again or try again later');
  //       console.log(err);
  //     })
  // }, [])

  return (
    <div className={css.movies}>
      {previewError && <p>{previewError}</p>}
      {preview && <Preview preview={preview} content={content} />}
      {mainError && <p >{mainError}</p>}
      {main && <Main content={content} setPage={setPage}/>}
    </div>
  )
}

export default Movies;