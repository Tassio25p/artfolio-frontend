export default function PostCard({
  image,
  avatar,
  user,
  title,
  description,
  tag,
  likes,
  comments,
  color = "artPurple",
}) {
  return (
    <div className="break-inside-avoid bg-white rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-black/5">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-auto group-hover:scale-110 transition-transform duration-700"
        />

        {tag && (
          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter shadow-sm">
            {tag}
          </div>
        )}
      </div>

      <div className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className={`w-8 h-8 rounded-full bg-${color} overflow-hidden`}>
            {avatar && (
              <img
                src={avatar}
                alt={user}
                className="object-cover w-full h-full"
              />
            )}
          </div>

          <span className="text-xs font-bold tracking-tight">{user}</span>
        </div>

        <h4 className="font-editorial text-2xl italic leading-tight group-hover:text-artPurple transition-colors">
          {title}
        </h4>

        {description && (
          <p className="text-sm text-gray-400 mt-2 font-light line-clamp-2">
            {description}
          </p>
        )}

        <div className="mt-6 pt-6 border-t border-black/5 flex justify-between items-center">
          <div className="flex space-x-5 text-gray-400">
            <button className="hover:text-artOrange transition-colors flex items-center space-x-1">
              <i className="fa-regular fa-heart"></i>
              <span className="text-[10px] font-bold">{likes}</span>
            </button>

            <button className="hover:text-artBlue transition-colors flex items-center space-x-1">
              <i className="fa-regular fa-comment"></i>
              <span className="text-[10px] font-bold">{comments}</span>
            </button>
          </div>

          <button className="text-artDark hover:scale-110 transition-transform">
            <i className="fa-regular fa-bookmark"></i>
          </button>
        </div>
      </div>
    </div>
  )
}