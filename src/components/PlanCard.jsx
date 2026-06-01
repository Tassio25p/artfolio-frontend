export default function PlanCard({
  name,
  description,
  price,
  priceColor = "text-artPurple",
  features,
  buttonText,
  popular = false,
  dark = false,
  iconColor = "text-artPurple",
}) {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-[2rem] p-8 transition-all ${
        dark
          ? "bg-artDark text-white shadow-2xl md:scale-[1.03]"
          : "bg-white border border-black/5 hover:shadow-2xl"
      }`}
    >
      {popular && (
        <div className="absolute top-6 right-6 bg-artPurple text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          Mais Popular
        </div>
      )}

      <div>
        <h3 className="text-xl font-black mb-2 uppercase">
          {name}
        </h3>

        <p className={`text-sm mb-6 ${dark ? "text-gray-400" : "text-gray-400"}`}>
          {description}
        </p>

        <div className="text-4xl font-black mb-6">
          {price}
          {price !== "Grátis" && (
            <span className={`text-lg ${priceColor}`}>
              /mês
            </span>
          )}
        </div>

        <ul className={`space-y-3 text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
          {features.map((feature, index) => (
            <li
              key={index}
              className={feature.disabled ? "opacity-30" : ""}
            >
              <i
                className={`fa-solid ${
                  feature.disabled ? "fa-xmark" : "fa-check"
                } ${feature.disabled ? "mr-2" : `${iconColor} mr-2`}`}
              ></i>
              {feature.text}
            </li>
          ))}
        </ul>
      </div>

      <button
        className={`mt-10 w-full py-3 rounded-full text-sm font-bold transition-all ${
          dark
            ? "bg-artPurple text-white hover:bg-white hover:text-artDark"
            : "border border-black hover:bg-black hover:text-white"
        }`}
      >
        {buttonText}
      </button>
    </div>
  )
}