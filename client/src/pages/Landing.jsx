import { Link } from "react-router-dom";

function Landing({ token }) {
	return (
		<section
			className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden"
			style={{
				backgroundImage: "url('/images/backdrop.jpg')",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="absolute inset-0 bg-black/40" aria-hidden="true" />

			<div className="relative z-10 w-screen border-white/15 border-y bg-black/55 py-12 backdrop-blur-sm sm:py-16">
				<div className="mx-auto max-w-4xl px-6 text-center text-white sm:px-10">
					<p className="mb-4 font-semibold text-blue-200 uppercase tracking-[0.25em]">
						Organize. Schedule. Perform.
					</p>
					<h2 className="font-extrabold text-4xl leading-tight sm:text-5xl md:text-6xl">
						Manage your productions from first rehearsal to final bow.
					</h2>
					<p className="mx-auto mt-6 max-w-2xl text-base text-gray-200 sm:text-lg">
						Performing Arts Manager keeps your organization, shows, members, and
						inventory all in one place so your team can stay focused on the
						performance.
					</p>
					<div className="mt-10 flex flex-wrap items-center justify-center gap-4">
						{!token ? (
							<>
								<Link
									to="/signup"
									className="rounded-md bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
								>
									Get Started
								</Link>
								<Link
									to="/login"
									className="rounded-md border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
								>
									Log In
								</Link>
							</>
						) : (
							<Link
								to="/organizations"
								className="rounded-md bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-600"
							>
								View Dashboard
							</Link>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

export default Landing;
