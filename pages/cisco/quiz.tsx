/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { parseCookies } from "nookies";
import { Quiz } from "@/components";

type HomeProps = {
  questions: any[];
};

export default function Home({ questions }: HomeProps) {
  return <Quiz menuLink="cisco" questions={questions} />;
}

export async function getServerSideProps(context: any) {
  const cookies = parseCookies(context);
  const token = cookies.token_cisco;

  // Si no hay token, redirige al usuario a la página de inicio de sesión
  if (!token) {
    return {
      redirect: {
        destination: "/cisco",
        permanent: false,
      },
    };
  }

  try {
    // Si el token es válido, obtén las preguntas y devuélvelas al componente
    const res = await fetch(
      "https://strapi-production-5785.up.railway.app/api/preguntas?populate=*&sort[0]=id",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const response = await res.json();
    let questions = response.data.map((question: any) => {
      return {
        question: question.attributes.pregunta,
        opcionMultiple: question.attributes.opcionMultiple,
        imagen: question.attributes.imagen?.data?.attributes?.url || null,
        answerOptions: question.attributes.respuestaOpcion.map(
          (option: any) => {
            return {
              isCorrect: option.isCorrect,
              answer: option.respuesta,
            };
          }
        ),
      };
    });

    // Obtener los parámetros de consulta
    const start = context.query.start;
    const end = context.query.end;

    // Filtrar las preguntas según el rango seleccionado por el usuario
    if (start && end) {
      questions = questions.slice(start - 1, end);
    }

    return {
      props: {
        questions,
      },
    };
  } catch {
    // Si el token no es válido, redirige al usuario a la página de inicio de sesión
    return {
      redirect: {
        destination: "/cisco",
        permanent: false,
      },
    };
  }
}
