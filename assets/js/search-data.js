// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-cv",
          title: "CV",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "My contributions to the field of robotics.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "news-i-am-honored-to-be-selected-as-the-recipient-of-the-arthur-m-hopkin-award-for-2021-22",
          title: 'I am honored to be selected as the recipient of the Arthur M....',
          description: "",
          section: "News",},{id: "news-i-graduated-from-the-eecs-department-of-uc-berkeley-with-honors",
          title: 'I graduated from the EECS department of UC Berkeley with honors.',
          description: "",
          section: "News",},{id: "news-check-out-my-contribution-bayesian-optimization-meets-hybrid-zero-dynamics-safe-parameter-learning-for-bipedal-locomotion-control-at-icra-2022",
          title: 'Check out my contribution Bayesian Optimization Meets Hybrid Zero Dynamics: Safe Parameter Learning...',
          description: "",
          section: "News",},{id: "news-i-have-passed-my-ph-d-candidacy-exam",
          title: 'I have passed my Ph.D. candidacy exam!',
          description: "",
          section: "News",},{id: "news-check-out-my-contribution-shield-safety-on-humanoids-via-cbfs-in-expectation-on-learned-dynamics-at-iros-2025",
          title: 'Check out my contribution SHIELD: Safety on Humanoids via CBFs In Expectation on...',
          description: "",
          section: "News",},{id: "news-check-out-my-contribution-bracing-for-impact-robust-humanoid-push-recovery-and-locomotion-with-reduced-order-models-at-humanoids-2025",
          title: 'Check out my contribution Bracing for Impact: Robust Humanoid Push Recovery and Locomotion...',
          description: "",
          section: "News",},];
