import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {Row, Col, Image, ListGroup, Card, Button, Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Meta from '../components/Meta'
import {listProductDetails, createProductReview} from '../actions/productActions'
import {PRODUCT_CREATE_REVIEW_RESET} from '../constants/productConstants'

const ProductScreen = ({history, match}) => {

  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const {loading, error, product} = productDetails

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin

  const productReviewCreate = useSelector((state) => state.productReviewCreate)
  const {error: errorProductReview, success: successProductReview} = productReviewCreate

  useEffect(() => {
    if(successProductReview) {
      alert('Comentário enviado, obrigado!')
      setRating(0)
      setComment('')
      dispatch({type: PRODUCT_CREATE_REVIEW_RESET})
    }

    if(errorProductReview) {
      alert('Ops, realizado um comentário neste produto.')
      setRating(0)
      setComment('')
      dispatch({type: PRODUCT_CREATE_REVIEW_RESET})
    }
   dispatch(listProductDetails(match.params.id))
  }, [dispatch, match, successProductReview, errorProductReview])
  
  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(match.params.id, {
      rating,
      comment
    }))
  }
  

  return (
    <>
      <Link className="btn btn-light my-3" to="/">Voltar</Link>
      {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
        <>
        <Meta title={product.name} />
        <Row>
        <Col md={6}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </ListGroup.Item>
            <ListGroup.Item>
              Preço: R${product.price}
            </ListGroup.Item>
            <ListGroup.Item>
              Descrição: {product.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>
                    Preço:
                  </Col>
                  <Col>
                    <strong>R${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>
                    Status:
                  </Col>
                  <Col>
                    {product.countInStock > 0 ? 'Em estoque' : 'Sem estoque'}
                  </Col>
                </Row>
              </ListGroup.Item>
              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control as="select" value={qty} onChange={(e) => setQty(e.target.value)}>
                        {[...Array(product.countInStock).keys()].map(x => (
                          <option key={x + 1} value={x + 1}>{x + 1}</option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <Button onClick={addToCartHandler} className="btn-block" type="button" disabled={product.countInStock === 0}>
                  Adicionar ao carrinho
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <h2>Reviews</h2>

          {product.reviews.length === 0 && (<Message>Sem reviews</Message>)}
          <ListGroup variant="flush">
            {product.reviews.map(review => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <Rating value={review.rating} />
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
            <ListGroup.Item>
              <h2>Escreva sua opnião sobre o produto</h2>
              {errorProductReview && <Message variant="danger">{errorProductReview}</Message>}
              {userInfo ? (
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="rating">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control as="select" value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="">Select..</option>
                    <option value="1">1 - Fraco</option>
                    <option value="2">2 - Razoável</option>
                    <option value="3">3 - Bom</option>
                    <option value="4">4 - Ótimo</option>
                    <option value="5">5 - Ameii</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="comment">
                  <Form.Label>Comentário</Form.Label>
                  <Form.Control as="textarea" row="3" value={comment} onChange={(e) => setComment(e.target.value)}>                    
                  </Form.Control>
                </Form.Group>
                <Button type="submit" variant="primary">Salvar</Button>
              </Form>) : <Message>Realize<Link to="/login"> o login</Link> para comentar {' '}</Message>}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      </>
      )}
      
    </>
  )
}

export default ProductScreen