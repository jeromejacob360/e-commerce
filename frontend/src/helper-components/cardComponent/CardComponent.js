import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import './CardComponent.css';

export default function CardComponent({ product }) {
  return (
    <Link className="card" to={`/product/${product._id}`}>
      <Card>
        <CardActionArea>
          <CardMedia
            component="img"
            height="240"
            image={product.images[0].url}
          />
          <CardContent>
            <Typography gutterBottom variant="span" component="span">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rs.{product.price}
            </Typography>
            {product.rating && (
              <Typography variant="body2" color="text.secondary">
                Rating: {product.rating}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              {product.numOfReviews} reviews
            </Typography>
          </CardContent>
        </CardActionArea>
        {/* <CardActions>
        <Button size="small" color="primary">
        Share
        </Button>
      </CardActions> */}
      </Card>
    </Link>
  );
}
