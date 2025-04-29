import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    minlength: [1, 'Comment must not be empty'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  }
}, { timestamps: true });

commentSchema.methods.updateLikesCount = function() {
  this.likesCount = this.likes.length;
  return this.save();
};

commentSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(id => id.toString() === userId.toString());
};

commentSchema.methods.like = function(userId) {
  if (!this.isLikedBy(userId)) {
    this.likes.push(userId);
    return this.updateLikesCount();
  }
  return this;
};

commentSchema.methods.unlike = function(userId) {
  if (this.isLikedBy(userId)) {
    this.likes = this.likes.filter(id => id.toString() !== userId.toString());
    return this.updateLikesCount();
  }
  return this;
};

commentSchema.post('save', async function() {
  const Post = mongoose.model('Post');
  await Post.findByIdAndUpdate(this.post, {
    $inc: { commentsCount: 1 }
  });
});

commentSchema.post('remove', async function() {
  const Post = mongoose.model('Post');
  await Post.findByIdAndUpdate(this.post, {
    $inc: { commentsCount: -1 }
  });
});

commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent'
});

commentSchema.set('toJSON', {
  virtuals: true
});

commentSchema.set('toObject', {
  virtuals: true
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;