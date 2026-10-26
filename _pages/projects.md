---
layout: page
title: Projects
permalink: /projects/
description: Interactive demos and games.
nav: true
nav_order: 5
---

<div class="projects">
  <div class="row row-cols-1 row-cols-md-2">
    {% assign sorted_projects = site.projects | sort: 'importance' %}
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
</div>
