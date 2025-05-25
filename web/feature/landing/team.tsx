import { Avatar, AvatarFallback, AvatarImage } from "../shared/ui/avatar";

const members = [
  {
    name: "Hunde Desalegn",
    role: "Backend Dev",
    avatar:
      "/https://github.com/team-hsi/Unified-Project-Management/blob/main/web/public/user.png",
    fallback: "HD",
  },
  {
    name: "Heyeman Abdisa",
    role: "Backend Dev",
    avatar:
      "https://github.com/team-hsi/Unified-Project-Management/blob/main/web/public/user.png",
    fallback: "HY-A",
  },
  {
    name: "Hikma Anwar",
    role: "Frontend Dev",
    avatar:
      "https://github.com/team-hsi/Unified-Project-Management/blob/main/web/public/user2.png4",
    fallback: "HK-A",
  },
  {
    name: "Senit Mengesha",
    role: "Frontend Dev",
    avatar:
      "https://github.com/team-hsi/Unified-Project-Management/blob/main/web/public/user2.png4",
    fallback: "SM",
  },
  {
    name: "Ifa Tolla",
    role: "Frontend Dev",
    avatar:
      "https://github.com/team-hsi/Unified-Project-Management/blob/main/web/public/user.png",
    fallback: "IT",
  },
];

export default function TeamSection() {
  return (
    <section className="md:py-22 py-12">
      <div className="mx-auto max-w-3xl px-8 lg:px-0">
        <h2 className="mb-8 text-4xl font-bold md:mb-16 lg:text-5xl">
          Our team
        </h2>
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
