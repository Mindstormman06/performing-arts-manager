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
