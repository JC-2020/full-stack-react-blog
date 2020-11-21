import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Comment, Form, Header, Segment } from 'semantic-ui-react'

export default function Comments() {
  const { postId } = useParams();
  const [ comments, setComments ] = useState([]);
  const [ author, setAuthor ] = useState('');
  const [ content, setContent ] = useState('');

  useEffect(() => {
    fetch(`/api/v1/posts/${postId}/comments`)
      .then(res => res.json())
      .then(data => {
        setComments(data);
      })
  }, [postId])

  const handleSubmit = () => {
    fetch(`/api/v1/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        author: author,
        content: content
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setAuthor('')
        setContent('')
        setComments(comments.concat(data.comment))
      })
  }

  return (
    <Segment>
      <Comment.Group>
        <Header as="h3">Comments</Header>
        { comments.length === 0 && (
          "No comments!"
        )}
        { comments.map(comment => {
          return (
            <Comment key={comment.id}>
              <Comment.Content>
                <Comment.Author as="span">{comment.author}</Comment.Author>
                <Comment.Metadata><div>{comment.createdAt}</div></Comment.Metadata>
                <Comment.Text>{comment.content}</Comment.Text>
              </Comment.Content>
            </Comment>
          )
        })}
        <Segment vertical>
          <Form onSubmit={handleSubmit} >
            <Header as="h4" dividing>Add New Comment</Header>
            <Form.Input required label="Author" type="text" value={author} onChange={(e) => { setAuthor(e.target.value) }} />
            <Form.TextArea required label="Content" value={content} onChange={(e) => { setContent(e.target.value) }} />
            <Button primary>Add Comment</Button>
          </Form>
        </Segment>
      </Comment.Group>
    </Segment>
  )
}

