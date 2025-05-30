import { Avatar, AvatarFallback, AvatarImage } from "../shared/ui/avatar";

const members = [
  {
    name: "Hunde Desalegn",
    role: "Full-Stack Developer",
    avatar: "/user.png",
    fallback: "HD",
  },
  {
    name: "Heyeman Abdisa",
    role: "Backend Developer",
    avatar: "/user.png",
    fallback: "HA",
  },
  {
    name: "Hikma Anwar",
    role: "UI/UX Designer",
    avatar: "/user2.png",
    fallback: "HA",
  },
  {
    name: "Senit Mengesha",
    role: "Frontend Developer",
    avatar: "/user2.png",
    fallback: "SM",
  },
  {
    name: "Ifa Tolla",
    role: "DevOps Engineer",
    avatar: "/user.png",
    fallback: "IT",
  },
];

export default function TeamSection() {
  return (
    <section className="md:py-22 py-12">
      <div className="mx-auto max-w-3xl px-8 lg:px-0">
        <h2 className="mb-8 text-4xl font-bold md:mb-16 lg:text-5xl">
          Team HSI
        </h2>
        <p className="mb-8 text-muted-foreground">
          Our talented team combines expertise in full-stack development, UI/UX design, and DevOps to deliver a comprehensive project management solution.
        </p>
        <div className="mt-6">
          <div
            data-rounded="full"
            className="grid grid-cols-2 gap-4 py-6 md:grid-cols-5"
          >
            {members.map((member, index) => (
              <div key={index}>
                <div className="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.fallback}</AvatarFallback>
                  </Avatar>
                </div>
                <span className="mt-2 block text-sm">{member.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
