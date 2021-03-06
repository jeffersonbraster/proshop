import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Form, Button, Row, Col} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import {register} from '../actions/userActions'


const RegisterScreen = ({location, history}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()

  const userRegister = useSelector(state => state.userRegister)
  const {loading, error, userInfo} = userRegister

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if(userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    if(password !== confirmPassword) {
      setMessage('As senhas não conferem')
    } else {
      dispatch(register(name, email, password))
    }    
  }

  return (
    <FormContainer>
      <h1>Registro</h1>
      {error && <Message variant="danger">{error}</Message>}
      {message && <Message variant="danger">{message}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Nome completo: </Form.Label>
          <Form.Control type="name" placeholder="Insira seu nome" value={name} onChange={e => setName(e.target.value)}>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>E-mail: </Form.Label>
          <Form.Control type="email" placeholder="Insira seu E-mail" value={email} onChange={e => setEmail(e.target.value)}>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Senha: </Form.Label>
          <Form.Control type="password" placeholder="Insira sua senha" value={password} onChange={e => setPassword(e.target.value)}>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirmar senha: </Form.Label>
          <Form.Control type="password" placeholder="Confirme a senha" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}>
          </Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Registrar
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Já possui acesso? {' '} <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen