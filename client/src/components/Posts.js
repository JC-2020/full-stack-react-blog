import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Form, Header, Modal, Segment } from 'semantic-ui-react'

export default function Posts() {
  const [ formOpen, setFormOpen ] = useState(false);
  const [ posts, setPosts ] = useState([])
  const [ title, setTitle ] = useState('');
  const [ author, setAuthor ] = useState('');
  const [ published, setPublished ] = useState('');
  const [ content, setContent ] = useState('');

  // componentDidMount
  useEffect(() => {
    fetch('/api/v1/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
      })
  }, [])

  const handleFormSubmit = (e) => {
    fetch('/api/v1/posts', {
      method: 'POST',
      body: JSON.stringify({
        author: author,
        title: title,
        published: published,
        content: content
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setFormOpen(false);
        setPosts(posts.concat(data));
        setTitle('')
        setAuthor('')
        setPublished('')
        setContent('')
      })

  }

  return (
    <div>
      <Header as="h1">Posts</Header>
      <Segment vertical >
        { posts.map((post) => {
          return <div key={post.id} style={{ marginBottom: '15px' }}>
            <Segment>
              <Header as="h2">{ post.title }</Header>
              <Header size='small'>{ post.author }</Header>
              <p>{ post.content.slice(0, 200)}{ post.content.length > 200 && "..."}</p>
              <Link to={`/post/${post.id}`}>Read More</Link>
            </Segment>
          </div>
        }) }
      </Segment>
      <Modal
        trigger={<Button>Add New Post...</Button>}
        open={formOpen}
        onOpen={() => setFormOpen(true)}
        onClose={() => setFormOpen(false)}
      >
        <Modal.Header>Add a new Post</Modal.Header>
        <Modal.Content>
          <Form id="newPostForm" onSubmit={handleFormSubmit}>
            <Form.Input required label="Title" type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} />
            <Form.Input required label="Author" type="text" value={author} onChange={(e) => { setAuthor(e.target.value) }} />
            <Form.Input required label="Publish Date" type="datetime-local" value={published} onChange={(e) => { setPublished(e.target.value) }} />
            <Form.TextArea required label="Content" value={content} onChange={(e) => { setContent(e.target.value) }} />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button positive form="newPostForm">Submit</Button>
        </Modal.Actions>
      </Modal>
    </div>
  )
}

