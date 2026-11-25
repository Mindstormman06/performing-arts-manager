/**
 * The application logo image.
 *
 * @remarks
 * Stateless. Serves `/logo/logo-256.png` from the client's public folder with a
 * `srcSet` of larger variants up to 5x density. Accepts an override for the
 * size classes and alt text, and spreads any other props onto the `<img>`.
 */
export default function Logo({
	className = "h-10 w-auto",
	alt = "Performing Arts Manager",
	...props
}) {
	return (
		<img
			src="/logo/logo-256.png"
			srcSet="
                /logo/logo-256.png 1x,
                /logo/logo-512.png 2x,
                /logo/logo-1024.png 3x,
                /logo/logo-2048.png 4x,
                /logo/logo-4096.png 5x,
            "
			alt={alt}
			className={`object-contain ${className}`}
			{...props}
		/>
	);
}
