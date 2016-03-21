<!DOCTYPE html>

<!--[if IE 9]>
  <html class="no-js lt-ie10 is-ie9" lang="en">
<![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js" lang="en">
<!--<![endif]-->

  {% include "_head.swig" %}

  <body class="{% block bodyClass %}{{ page }}{% endblock %}">

    {% include "_header.swig" %}

    <div id="main" role="main">
      {% block main %}
      <div class="container">
        <p>Main block, ladies and gentlemen</p>
      </div>
      {% endblock %}
    </div>

    {% include "_footer.swig" %}

    {% include "_scripts.swig" %}

  </body>
</html>