import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Button,
  Container,
  Dialog,
  Fab,
  Toolbar,
  Typography
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'
import NoteIcon from './NoteIcon'
import Note from './Note'
const axios = require('axios').default

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  container: {
    height: '100vh'
  }
}))

;(function () {
  const token = window.localStorage.getItem('token')
  if (token) axios.defaults.headers.common['x-access-token'] = token
  else axios.defaults.headers.common['x-access-token'] = null
})()

export default function Notes (props) {
  const [notes, setNotes] = useState([])
  const [editNote, setEditNote] = useState({})
  const [showEditNote, setShowEditNote] = useState(false)
  const classes = useStyles()

  const signOut = function () {
    props.handleSignOut()
  }

  useEffect(() => {
    let ignore = false

    async function fetchData () {
      try {
        const response = await axios(
          process.env.REACT_APP_API_URL + '/api/notes'
        )
        if (response.status !== 200) {
          throw new Error('Cannot get notes')
        }
        if (!ignore) setNotes(response.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
    return () => {
      ignore = true
    }
  }, [])


  function handleClick (id) {
    setEditNote(notes.filter(n => n.id === id)[0])
    setShowEditNote(true)
  }

  async function addNote () {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + '/api/notes',
        {
          contents: 'New note! Move it around! Tap to edit!',
          posx: Math.floor(Math.random() * 100),
          posy: Math.floor(Math.random() * 100)
        }
      )
      let newNote = response.data
      setNotes([...notes, newNote])
    } catch (err) {
      console.log(err)
    }
  }

  function handleNoteContentsChange (contents) {
    let newEditNote = JSON.parse(JSON.stringify(editNote))
    newEditNote.contents = contents
    setEditNote(newEditNote)
  }

  // delete the note that is currently being edited
  async function deleteNote () {
    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_URL + '/api/notes/' + editNote.id
      )
      if (response.status !== 200) throw new Error(response.status)
    } catch (err) {
      console.log("Couldn't delete note with id " + editNote.id + '. ' + err)
    }

    setNotes(prev => prev.filter(n => n.id !== editNote.id))
    setShowEditNote(false)
  }

  // save the edit note to the array and to the server
  function handleNoteContentsSave () {
    updateNote(editNote.id, editNote.posx, editNote.posy, editNote.contents)
    setShowEditNote(false)
  }

  async function updateNote (id, x, y, contents) {
    let notesCopy = notes.map(n => {
      if (n.id === id) {
        n.posx = x
        n.posy = y
        if (contents) n.contents = contents
        return n
      } else {
        return n
      }
    })
    const updatedNote = notesCopy.filter(n => n.id === id)[0]
    if (!updatedNote) {
      console.log("Couldn't find note with id " + id)
      return
    }

    setNotes(notesCopy)
    try {
      const response = await axios.patch(
        process.env.REACT_APP_API_URL + '/api/notes/' + id,
        {
          contents: updatedNote.contents,
          posx: updatedNote.posx,
          posy: updatedNote.posy
        }
      )
      if (response.status !== 200) throw new Error(response.status)
    } catch (err) {
      console.log("Couldn't update note with id " + id + '. ' + err)
    }
  }

  const noteComponents = notes.map(n => (
    <NoteIcon
      key={n.id}
      details={n}
      onUpdatePosition={updateNote}
      onClick={() => handleClick(n.id)}
    />
  ))

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' className={classes.title}>
            Your Notes - {window.localStorage.getItem('email')}
          </Typography>
          <Button color='inherit' onClick={signOut}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Fab color='primary' aria-label='add' onClick={addNote}>
        <AddIcon />
      </Fab>
      <Container className={classes.container}>{noteComponents}</Container>
      <Dialog
        onClose={handleNoteContentsSave}
        aria-labelledby='edit note'
        open={showEditNote}
      >
        <Note
          details={editNote}
          onChange={handleNoteContentsChange}
          onDelete={deleteNote}
          onClose={handleNoteContentsSave}
          
        />
      </Dialog>
    </>
  )
}
